import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { User } from "../models";
import { AdminUser } from "../models/admin/";
import "dotenv/config"

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json("Invalid token configuation");
    }
    const bearerHearder = authHeader.split(" ")[1];

    // decrypt the token
    if (bearerHearder != "") {
      const publicId: any = jwt.verify(bearerHearder!, process.env.SECRET_KEY!);
      const user = await User.findOne({ publicId: publicId.user });
      if (user == null)
        return res.status(403).json({ message: "Login Reqired" });
      res.locals.userCredential = user;
      next();
      // console.log(user, " User");
    } else {
      return res.status(403).json({ message: "Login Reqired" });
    }
  }
  catch {
    return res.status(401).json({ message: "No Authentication header provided" });
  }
};

const isLoggedInAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(400).json("Invalid token configuation");
    }
    const bearerHearder = authHeader.split(" ")[1];

    // decrypt the token
    if (bearerHearder != "") {
      const publicId: any = jwt.verify(bearerHearder!, process.env.SECRET_KEY!);
      const user = await AdminUser.findOne({ publicId: publicId.user });
      // console.log(user, " Admin");
      if (user == null)
        return res.status(403).json({ message: "Login Reqired" });

      res.locals.userCredential = user;
      next();
    } else {
      return res.status(403).json({ message: "Login Reqired" });
    }
  }
  catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export { isLoggedInAdmin, isLoggedIn }