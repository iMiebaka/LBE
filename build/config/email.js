"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
require("dotenv/config");
const staticData_1 = require("../utils/staticData");
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
const NAMESPACE = "EMAIL-UNIT";
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});
transporter.verify(function (error, success) {
    if (error) {
        logger_1.default.warn(NAMESPACE, error.message);
    }
    else {
        logger_1.default.info(NAMESPACE, "Server is ready to take our messages 📧");
    }
});
const resetPasswordValue = (otp) => (` 
Dear valued ${config_1.default.PLATFORM_NAME} user,

We have received a request to reset the password for your account. If you did not request a password reset, please ignore this email.

To reset your password, please copy the code below:

${otp}

Thank you for using ${config_1.default.PLATFORM_NAME}.

Best regards,
The ${config_1.default.PLATFORM_NAME} Team`);
const validateAccountValue = (otp) => (` 
Dear [user],

We have received a request to reset the password for your ${config_1.default.PLATFORM_NAME} account. To complete the process, please enter the following verification code:

${otp}

This code is only valid for the next 15 minutes. If you did not request a password reset, please ignore this email.

Thank you for using ${config_1.default.PLATFORM_NAME}.

Best regards,
The ${config_1.default.PLATFORM_NAME} Team`);
const emailValidationCompleted = () => (`
Dear [user],

Welcome to ${config_1.default.PLATFORM_NAME}! We are thrilled to have you as a member of our community.

Your account has been successfully created and is now ready for use. You can login to access our wide range of optometry quizzes and track your progress as you advance your knowledge and skills.

We hope you enjoy using ${config_1.default.PLATFORM_NAME} and find it a valuable resource in your optometry journey. If you have any questions or feedback, please don't hesitate to contact us at info@${config_1.default.PLATFORM_NAME}.com.

Best regards,
The ${config_1.default.PLATFORM_NAME} Team
`);
const sendEmail = (user, init, otp) => {
    let message = "";
    let subMessage = "";
    if (init == "reset") {
        message = resetPasswordValue(otp);
        subMessage = `${config_1.default.PLATFORM_NAME} - Reset your password 🔐`;
    }
    if (init == "validate") {
        message = validateAccountValue(otp);
        subMessage = `${config_1.default.PLATFORM_NAME} - Validate your account`;
    }
    if (init == "transfer_funds") {
        message = (0, staticData_1.pendingTransaction)(otp);
        subMessage = `${config_1.default.PLATFORM_NAME} - Transfer funds`;
    }
    if (process.env.RUNTIME == "production") {
        transporter.sendMail({
            from: `"${config_1.default.PLATFORM_NAME} Support 💰" <noreply@example.com>`,
            to: user.email,
            subject: subMessage,
            html: message, // html body
        }).then((info) => {
            logger_1.default.info(NAMESPACE, info.response);
            // console.log(info.messageId);
        });
    }
    else {
        console.log(message);
    }
};
exports.default = sendEmail;
