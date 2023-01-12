"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = exports.isLoggedInAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { User } from "../models";
// import { AdminUser } from "../models/admin/";
require("dotenv/config");
const models_1 = require("../models");
const config_1 = require("../config");
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json("Invalid token configuation");
        }
        const bearerHearder = authHeader.split(" ")[1];
        // decrypt the token
        if (bearerHearder != "") {
            const publicId = jsonwebtoken_1.default.verify(bearerHearder, config_1.config.SECRET_KEY);
            const user = yield models_1.User.query().select().where("public_id", publicId.user);
            console.log(user.length);
            if (user.length !== 1)
                return res.status(403).json({ message: "Login Reqired" });
            res.locals.userCredential = user[0];
            next();
            // console.log(user, " User");
        }
        else {
            return res.status(403).json({ message: "Login Reqired" });
        }
    }
    catch (_a) {
        return res.status(401).json({ message: "No Authentication header provided" });
    }
});
exports.isLoggedIn = isLoggedIn;
const isLoggedInAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(400).json("Invalid token configuation");
        }
        const bearerHearder = authHeader.split(" ")[1];
        // decrypt the token
        if (bearerHearder != "") {
            // const publicId: any = jwt.verify(bearerHearder!, process.env.SECRET_KEY!);
            // const user = await AdminUser.findOne({ publicId: publicId.user });
            // // console.log(user, " Admin");
            // if (user == null)
            //   return res.status(403).json({ message: "Login Reqired" });
            // res.locals.userCredential = user;
            next();
        }
        else {
            return res.status(403).json({ message: "Login Reqired" });
        }
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});
exports.isLoggedInAdmin = isLoggedInAdmin;
