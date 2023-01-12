"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const safe_1 = __importDefault(require("colors/safe"));
const timeStamp = () => new Date().toISOString();
const success = (namespace, args) => {
    console.log(safe_1.default.green(`[${timeStamp()}] [INFO] [${namespace}] ${args}`));
};
const info = (namespace, args) => {
    console.log(safe_1.default.blue(`[${timeStamp()}] [INFO] [${namespace}] ${args}`));
};
const error = (namespace, args) => {
    console.log(safe_1.default.red(`[${timeStamp()}] [ERROR] [${namespace}] ${args}`));
};
const warn = (namespace, args) => {
    console.log(safe_1.default.yellow(`[${timeStamp()}] [WARNING] [${namespace}] ${args}`));
};
const logger = { warn, error, info, success };
exports.default = logger;
