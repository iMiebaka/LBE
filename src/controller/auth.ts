import { Request, Response, NextFunction } from "express";
import { User } from "../models"
import { Document } from 'mongoose';
import jwt from "jsonwebtoken"
import "dotenv/config"
import { sendEmail } from "../config";
import { v4 } from "uuid";
import bcrypt from "bcrypt";


interface UserModel extends Document {
  comparePassword(password: string): Promise<boolean>;
  publicId: string
}

const loginUserPut = (async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (username == undefined) return res.status(400).json({ message: "username not defined" });
  if (password == undefined) return res.status(400).json({ message: "password not defined" });

  try {
    const user: UserModel = await User.findOne({ username }) as UserModel;
    if (!user) return res.json({ message: "username does not exist" }).status(404);

    if (user) {
      const canLogin = await user.comparePassword(password);
      if (!canLogin) return res.json({ message: "Incorrect password" });
      const token = jwt.sign({ user: user.publicId }, process.env.SECRET_KEY!);
      return res.status(200).json({
        message: "Login successfull",
        id: user.publicId, token,
      });
    } else {
      return res.json({ message: "User not found" });
    }
  } catch {
    return res.json({ message: "User not found" }).status(500);
  }
})

const createUserPost = (async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  let userExist = await User.findOne({ email })
  if (userExist !== null)
    return res.json({ message: "Email already exist" });
  userExist = await User.findOne({ username })
  if (userExist !== null)
    return res.json({ message: "Username already exist" });

  try {
    const user = new User({
      username,
      email,
      password
    }
    );
    await user.save()
    if (user) {
      return res.json({ message: "User created" });
    } else {
      return res.json({ message: "User not found" });
    }
  } catch (err: any) {
    console.log(err.message);
    return res.json({ message: "Could not complete registeration" });
  }
})


const loginUserGet = (async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: Object(id) });
    if (user) {
      return res.json({ user });
    } else {
      return res.json({ message: "User not found" });
    }
  } catch {
    return res.json({ message: "Cannot continue at the moment" });
  }
})


const recoverUserPost = (async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    let canSearch = true
    let otp: number = 0;
    while (canSearch) {
      otp = Math.round(Math.random() * 100000)
      const user = await User.findOne({ otp });
      if (user === null) canSearch = false
    }
    await User.findOneAndUpdate({ email }, { $set: { otp } });
    sendEmail("reset", otp)
    if (user) {
      return res.status(200).json({ message: "An otp has been sent to you email" });
    } else {
      return res.status(404).json({ message: "Email not registerd" });
    }
  } catch {
    return res.json({ message: "Cannot continue at the moment" });
  }
})

const recoverPasswordUserPost = (async (req: Request, res: Response, next: NextFunction) => {
  const { otp, id, password } = req.body;
  try {
    if (id == undefined) {
      const user = await User.findOne({ otp });
      return res.status(200).json({ message: user?._id });
    } else {
      if (password == "")
        return res.json({ message: "Password field is empty" });
      const salt = await bcrypt.genSalt();
      const passwordNew = await bcrypt.hash(password!, salt);

      await User.findByIdAndUpdate(id, { $set: { publicId: v4(), password: passwordNew } });
      return res.json({ message: "Password changed successfully" });
    }


  } catch {
    return res.status(400).json({ message: "Cannot continue at the moment" });
  }
})

export { createUserPost, loginUserPut, loginUserGet, recoverUserPost, recoverPasswordUserPost }