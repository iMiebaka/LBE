import { Request, Response, NextFunction } from "express";
import { AdminUser } from "../../models/admin"
import { Document } from 'mongoose';
import jwt from "jsonwebtoken"



interface AdminUserModel extends Document {
    comparePassword(password: string): Promise<boolean>;
    publicId: string
}

const adminCreateUserPost = (async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    // return res.json({ message: "Email already exist" }).status(400);
    let userExist = await AdminUser.findOne({ email })
    if (userExist !== null)
        return res.status(400).json({ message: "Email already exist" });
    userExist = await AdminUser.findOne({ username })
    if (userExist !== null)
        return res.status(400).json({ message: "Username already exist" });

    try {
        const user = new AdminUser({
            username,
            email,
            password
        }
        );
        await user.save()
        if (user) {
            return res.status(201).json({ message: "User created" });
        } else {
            return res.status(400).json({ message: "Cannot create User" });
        }
    } catch (err: any) {
        return res.json({ message: err.message });
    }
})

const adminLoginUserPut = (async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    if (username == undefined) return res.status(400).json({ message: "username not defined" });
    if (password == undefined) return res.status(400).json({ message: "password not defined" });

    try {
        const user: AdminUserModel = await AdminUser.findOne({ username }) as AdminUserModel;
        if (user === null) {
            return res.status(404).json({ message: "username does not exist" });
        }

        if (user) {
            const canLogin = await user.comparePassword(password);
            if (!canLogin) return res.json({ message: "Incorrect password" });
            const token = jwt.sign({ user: user.publicId }, process.env.SECRET_KEY!);
            return res.status(200).json({
                message: "Login successfully",
                id: user.publicId, token,
            });
        } else {
            return res.status(404).json({ message: "Incorrect password" });
        }
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
})


const adminLoginUserGet = (async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await AdminUser.findOne({ _id: Object(id) });
        if (user) {
            return res.json({ user });
        } else {
            return res.json({ message: "User not found" });
        }
    } catch {
        return res.json({ message: "Cannot continue at the moment" });
    }
})




export { adminCreateUserPost, adminLoginUserPut, adminLoginUserGet }