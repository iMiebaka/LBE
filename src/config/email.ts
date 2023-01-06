
const nodemailer = require("nodemailer");
import "dotenv/config"
import config from "./config";
import logger from "./logger";

const NAMESPACE = "EMAIL-UNIT"


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

transporter.verify(function (error: any, success: any) {
    if (error) {
        logger.warn(NAMESPACE, error.message);
    } else {
        logger.info(NAMESPACE, "Server is ready to take our messages 📧");
    }
});

const resetPasswordValue = (otp: number): string => (` 
Dear valued ${config.PLATFORM_NAME} user,

We have received a request to reset the password for your account. If you did not request a password reset, please ignore this email.

To reset your password, please copy the code below:

${otp}

Thank you for using ${config.PLATFORM_NAME}.

Best regards,
The ${config.PLATFORM_NAME} Team`)


const validateAccountValue = (otp: number): string => (` 
Dear [user],

We have received a request to reset the password for your ${config.PLATFORM_NAME} account. To complete the process, please enter the following verification code:

${otp}

This code is only valid for the next 15 minutes. If you did not request a password reset, please ignore this email.

Thank you for using ${config.PLATFORM_NAME}.

Best regards,
The ${config.PLATFORM_NAME} Team`)



const emailValidationCompleted = (): string => (`
Dear [user],

Welcome to ${config.PLATFORM_NAME}! We are thrilled to have you as a member of our community.

Your account has been successfully created and is now ready for use. You can login to access our wide range of optometry quizzes and track your progress as you advance your knowledge and skills.

We hope you enjoy using ${config.PLATFORM_NAME} and find it a valuable resource in your optometry journey. If you have any questions or feedback, please don't hesitate to contact us at info@${config.PLATFORM_NAME}.com.

Best regards,
The ${config.PLATFORM_NAME} Team
`)

const sendEmail = (user:any, init: string, otp: number) => {
    let message: string = "";
    let subMessage: string = "";
    if (init == "reset") {
        message = resetPasswordValue(otp)
        subMessage = `${config.PLATFORM_NAME} - Reset your password 🔐`
    }
    if (init == "validate") {
        message = validateAccountValue(otp)
        subMessage = `${config.PLATFORM_NAME} - Validate your account`
    }
    if (process.env.RUNTIME == "production") {
        transporter.sendMail({
            from: `"Miebaka from ${config.PLATFORM_NAME} 💝" <noreply@example.com>`, // sender address
            to: user.email, // list of receivers
            subject: subMessage, // Subject line
            html: message, // html body
        }).then((info: any) => {
            logger.info(NAMESPACE, info.response);
            // console.log(info.messageId);
        })
    }
    else {
        console.log(message)
    }

}


export default sendEmail

