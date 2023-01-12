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
exports.loginUserGet = exports.loginUserPut = exports.createUserPost = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const config_1 = require("../config");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const NAMESPACE = "AUTH";
const loginUserPut = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (email == undefined)
        return res.status(400).json({ message: "email not defined" });
    if (password == undefined)
        return res.status(400).json({ message: "password not defined" });
    try {
        const user = yield User_1.default.query().findOne("email", email);
        if (user == undefined)
            return res.status(404).json({ message: "email does not exist" });
        if (user) {
            const canLogin = yield bcrypt_1.default.compare(password.toString(), user.password);
            if (!canLogin)
                return res.status(400).json({ message: "Incorrect password" });
            const token = jsonwebtoken_1.default.sign({ user: user.public_id }, process.env.SECRET_KEY);
            return res.status(200).json({
                message: "Login successfull",
                id: user.public_id, token,
            });
        }
        else {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        config_1.logger.error(`${NAMESPACE} - LOGIN`, err.message);
        return res.status(500).json({ message: err.message });
    }
}));
exports.loginUserPut = loginUserPut;
const createUserPost = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password } = req.body;
    try {
        if (config_1.config.RUNTIME != "test" && (utils_1.TEST_USER.user1.email == email || utils_1.TEST_USER.user2.email == email))
            return res.status(400).json({ message: "Cannot use test user emails" });
        const userExist = yield User_1.default.query().findOne("email", email);
        if (userExist)
            return res.status(400).json({ message: "Email already exist" });
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const hashpin = yield bcrypt_1.default.hash("1234", 10);
        const user = yield User_1.default.query().insert({
            id: (0, uuid_1.v4)(),
            public_id: (0, uuid_1.v4)(),
            first_name,
            last_name,
            email,
            pin: hashpin,
            password: hashPassword
        });
        yield models_1.Wallet.query().insert({
            id: (0, uuid_1.v4)(),
            user_id: user.id,
            amount: 0.0,
            account_number: Math.round(Math.random() * 1000000000),
        });
        if (user) {
            // sendEmail(email, "validate", otp)
            return res.status(201).json({ message: "User created" });
        }
        else {
            return res.status(400).json({ message: "Cannot create user" });
        }
    }
    catch (err) {
        config_1.logger.error(`${NAMESPACE} - SIGNUP`, err.message);
        return res.status(400).json({ message: "Could not complete registeration" });
    }
}));
exports.createUserPost = createUserPost;
const loginUserGet = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.query().select().findById(id);
        if (user) {
            return res.json({ user });
        }
        else {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        config_1.logger.error(`${NAMESPACE} - LOGIN-GET`, err.message);
        return res.status(500).json({ message: "Cannot continue at the moment" });
    }
}));
exports.loginUserGet = loginUserGet;
