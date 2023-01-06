import { Request, Response, NextFunction } from "express";
import { User } from "../models"
import { Document } from 'mongoose';

interface UserModel extends Document {
    comparePassword(password: string): Promise<boolean>;
}

const createUserPost = (async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    try {
        const user: UserModel = await User.findOne({ username }) as UserModel;

        if (user) {

            const canLogin = await user.comparePassword(password);

            // return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
        } else {
            return res.json({ message: "Genre not found" });
        }
    } catch {
        return res.json({ message: "Genre not found" });
    }
})

const loginUserPut = (async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    try {
        const genre = await User.create(
            username,
            email,
            password
        );
        if (genre) {
            return res.json({ genre });
        } else {
            return res.json({ message: "Genre not found" });
        }
    } catch {
        return res.json({ message: "Genre not found" });
    }
})


const loginUserGet = (async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const genre = await User.findOne({ _id: Object(id) });
        if (genre) {
            return res.json({ genre });
        } else {
            return res.json({ message: "Genre not found" });
        }
    } catch {
        return res.json({ message: "Genre not found" });
    }
})




export { createUserPost, loginUserPut, loginUserGet }