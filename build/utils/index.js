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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_USER = exports.TRANSACTION_STATE = exports.TRANSACTION_LEVEL = exports.creditAlertStatement = exports.debitAlertStatement = exports.checkUser = exports.checkBalance = void 0;
const models_1 = require("../models");
const config_1 = require("../config");
const staticData_1 = require("./staticData");
Object.defineProperty(exports, "creditAlertStatement", { enumerable: true, get: function () { return staticData_1.creditAlertStatement; } });
Object.defineProperty(exports, "debitAlertStatement", { enumerable: true, get: function () { return staticData_1.debitAlertStatement; } });
Object.defineProperty(exports, "TEST_USER", { enumerable: true, get: function () { return staticData_1.TEST_USER; } });
const TRANSACTION_LEVEL = {
    TRANSFER: "TRANSFER",
    WITHDRAWAL: "WITHDRAWAL"
};
exports.TRANSACTION_LEVEL = TRANSACTION_LEVEL;
const TRANSACTION_STATE = {
    PENDING: "PENDING",
    TIMEOUT: "TIMEOUT",
    COMPLETED: "COMPLETED"
};
exports.TRANSACTION_STATE = TRANSACTION_STATE;
const checkBalance = (user, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const userInit = yield models_1.Wallet.query().where("user_id", user);
    return calcultateIntrest(amount, userInit[0].amount);
});
exports.checkBalance = checkBalance;
const checkUser = (user, type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.User.query().where(type, user);
});
exports.checkUser = checkUser;
const calcultateIntrest = (amount, total) => {
    return amount + ((config_1.config.COMMISSION / 100) * total) > total;
};
