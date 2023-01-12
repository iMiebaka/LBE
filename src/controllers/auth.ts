import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import "dotenv/config"
import { config, logger, sendEmail } from "../config";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import knex from "../database/db";
import { randomUUID } from "crypto";
import User from "../models/User";
import { ITUser } from "../interface";
import { Wallet } from "../models";
import { TEST_USER } from "../utils";

const NAMESPACE = "AUTH"

const loginUserPut = (async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (email == undefined) return res.status(400).json({ message: "email not defined" });
    if (password == undefined) return res.status(400).json({ message: "password not defined" });

    try {

        const user = await User.query().findOne("email", email)
        if (user == undefined) return res.status(404).json({ message: "email does not exist" });
        if (user) {
            const canLogin = await bcrypt.compare(password.toString(), user.password);
            if (!canLogin) return res.status(400).json({ message: "Incorrect password" });
            const token = jwt.sign({ user: user.public_id }, process.env.SECRET_KEY!);
            return res.status(200).json({
                message: "Login successfull",
                id: user.public_id, token,
            });
        } else {
            return res.status(404).json({ message: "User not found" })
        }
    } catch (err: any) {
        logger.error(`${NAMESPACE} - LOGIN`, err.message)
        return res.status(500).json({ message: err.message });
    }
})

const createUserPost = (async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        if (config.RUNTIME != "test" && (TEST_USER.user1.email == email || TEST_USER.user2.email == email))
            return res.status(400).json({ message: "Cannot use test user emails" });
        const userExist = await User.query().findOne("email", email)

        if (userExist)
            return res.status(400).json({ message: "Email already exist" });

        const hashPassword = await bcrypt.hash(password, 10)
        const hashpin = await bcrypt.hash("1234", 10)
        const user = await User.query().insert({
            id: v4(),
            public_id: v4(),
            first_name,
            last_name,
            email,
            pin: hashpin,
            password: hashPassword
        });
        await Wallet.query().insert({
            id: v4(),
            user_id: user.id,
            amount: 0.0,
            account_number: Math.round(Math.random() * 1000000000),
        });
        if (user) {
            // sendEmail(email, "validate", otp)
            return res.status(201).json({ message: "User created" });
        } else {
            return res.status(400).json({ message: "Cannot create user" });
        }
    } catch (err: any) {
        logger.error(`${NAMESPACE} - SIGNUP`, err.message)
        return res.status(400).json({ message: "Could not complete registeration" });
    }
})


const loginUserGet = (async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await User.query().select().findById(id);
        if (user) {
            return res.json({ user });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (err: any) {
        logger.error(`${NAMESPACE} - LOGIN-GET`, err.message)
        return res.status(500).json({ message: "Cannot continue at the moment" });
    }
})


// const recoverUserPost = (async (req: Request, res: Response, next: NextFunction) => {
//     const { email } = req.body;
//     try {
//         const user = await knex("user").select({ email });
//         let canSearch = true
//         let otp: number = 0;
//         while (canSearch) {
//             otp = Math.round(Math.random() * 100000)
//             const user = await User.findOne({ otp });
//             if (user === null) canSearch = false
//         }
//         if (user) {
//             await User.findOneAndUpdate({ email }, { $set: { otp } });
//             // sendEmail(user?.email, "recover", otp)
//             return res.status(200).json({ message: "An otp has been sent to you email" });
//         } else {
//             return res.status(404).json({ message: "Email not registerd" });
//         }
//     } catch (err: any) {
//         logger.error(`${NAMESPACE} - LOGIN-RECOVER`, err.message)
//         return res.status(500).json({ message: err.message });
//     }
// })


// const verifyAccountPatch = (async (req: Request, res: Response, next: NextFunction) => {
//     const { otp } = req.body;
//     try {
//         const user = await User.findOne({ otp });
//         if (user) {
//             user.otp = ""
//             user.validatedAccount = true
//             user.save()
//             return res.status(200).json({ message: "Verification completed" });
//         } else {
//             return res.status(404).json({ message: "Could not complete account verification" });
//         }
//     } catch (err: any) {
//         logger.error(`${NAMESPACE} - LOGIN-RECOVER`, err.message)
//         return res.status(500).json({ message: err.message });
//     }
// })


// const recoverPasswordUserPost = (async (req: Request, res: Response, next: NextFunction) => {
//     const { otp, id, password } = req.body;
//     try {
//         if (id == undefined) {
//             const user = await User.findOne({ otp });
//             return res.status(200).json({ message: user?._id });
//         } else {
//             if (password == "")
//                 return res.json({ message: "Password field is empty" });
//             const salt = await bcrypt.genSalt();
//             const passwordNew = await bcrypt.hash(password!, salt);

//             await User.findByIdAndUpdate(id, { $set: { publicId: v4(), password: passwordNew } });
//             return res.json({ message: "Password changed successfully" });
//         }


//     } catch (err: any) {
//         logger.error(`${NAMESPACE} - LOGIN-RECOVER-POST`, err.message)
//         return res.status(400).json({ message: err.message });
//     }
// })


// verifyAccountPatch, recoverUserPost, recoverPasswordUserPost
export { createUserPost, loginUserPut, loginUserGet }