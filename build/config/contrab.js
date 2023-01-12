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
const node_cron_1 = __importDefault(require("node-cron"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("./logger"));
const NAMESPACE = "Cronjob";
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    // Code to run every minute
    const hotWireTransaction = yield models_1.HotWireTransaction.query().select().where("status", utils_1.TRANSACTION_STATE.PENDING);
    hotWireTransaction.forEach((transaction) => {
        logger_1.default.warn(NAMESPACE, transaction.created_at.toISOString());
    });
}));
exports.default = node_cron_1.default;
