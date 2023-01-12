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
exports.checkUserBalance = exports.withdrawAccount = exports.transferAccount = exports.creditAccount = void 0;
const config_1 = require("../config");
const uuid_1 = require("uuid");
const models_1 = require("../models/");
const utils_1 = require("../utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const NAMESPACE = "Wallet";
const creditAccount = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    if (amount == undefined)
        return res.status(400).json({ message: "amount params not defined" });
    try {
        if (+amount < 1)
            return res.status(400).json({ message: "Credit amount less than 1" });
        const previousAcount = yield models_1.Wallet.query().select().findOne("user_id", res.locals.userCredential.id);
        if (previousAcount != undefined) {
            yield models_1.Wallet.query().select().where("user_id", res.locals.userCredential.id).patch({
                amount: (+amount) + previousAcount.amount
            });
            yield models_1.Statement.query().insert({
                id: (0, uuid_1.v4)(),
                user_id: res.locals.userCredential.id,
                description: (0, utils_1.creditAlertStatement)(amount + previousAcount.amount)
            });
            return res.status(201).json({ message: "Account Credited" });
        }
        return res.status(400).json({ message: "No transaction initiated" });
    }
    catch (err) {
        config_1.logger.error(`${NAMESPACE} - CREDIT-ACOUNT`, err.message);
        return res.status(500).json({ message: err.message });
    }
}));
exports.creditAccount = creditAccount;
const transferAccount = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { complete } = req.query;
    if (complete) {
        try {
            const { pin } = req.body;
            if (pin == undefined)
                return res.status(400).json({ message: "pin params not defined" });
            // check if pin is correct
            const canWithdraw = yield bcrypt_1.default.compare((pin).toString(), res.locals.userCredential.pin);
            if (!canWithdraw)
                return res.status(400).json({ message: "incorrect pin" });
            // Get incomplete ledger transaction
            const hotWireTransaction = yield models_1.HotWireTransaction.query().select().where("status", utils_1.TRANSACTION_STATE.PENDING).where("user_id", res.locals.userCredential.id);
            const transaction = hotWireTransaction[0];
            if (transaction == null)
                return res.status(400).json({ message: "Invalid Transaction" });
            // Comfirm the state of the request
            // Sent response when transaction was timeout or completed
            if (transaction.status != utils_1.TRANSACTION_STATE.PENDING) {
                if (transaction.status == utils_1.TRANSACTION_STATE.TIMEOUT)
                    return res.status(400).json({ message: "Transaction Timeout" });
                else if (transaction.status == utils_1.TRANSACTION_STATE.COMPLETED)
                    return res.status(400).json({ message: "Transaction already completed" });
            }
            // Get wallet balance
            const senderAcount = yield models_1.Wallet.query().findOne("user_id", res.locals.userCredential.id);
            // Debit User 
            yield models_1.Wallet.query().select().where("user_id", res.locals.userCredential.id).patch({
                amount: senderAcount.amount - transaction.amount
            });
            // Get wallet balance
            const recieverAcount_ = yield models_1.Wallet.query().where("user_id", hotWireTransaction[0].reciever_id);
            const recieverAcount = recieverAcount_[0];
            // Credit User 
            yield models_1.Wallet.query().select().where("user_id", hotWireTransaction[0].reciever_id).patch({
                amount: transaction.amount + recieverAcount.amount
            });
            // Return Success
            res.status(201).json({ message: "Transfer Completed" });
            // Update transaction state
            yield models_1.HotWireTransaction.query().select().findById(hotWireTransaction[0].id).patch({
                status: utils_1.TRANSACTION_STATE.COMPLETED
            });
            // Add statement for sender
            yield models_1.Statement.query().insert({
                id: (0, uuid_1.v4)(),
                description: (0, utils_1.debitAlertStatement)(senderAcount.amount - transaction.amount),
                user_id: res.locals.userCredential.id
            });
            //  Add statement for reciever
            yield models_1.Statement.query().insert({
                id: (0, uuid_1.v4)(),
                description: (0, utils_1.creditAlertStatement)(transaction.amount + recieverAcount.amount),
                user_id: transaction.reciever_id
            });
        }
        catch (err) {
            config_1.logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message);
            return res.status(500).json({ message: err.message });
        }
    }
    else {
        const { amount, reciever_account_number } = req.body;
        if (amount == undefined)
            return res.status(400).json({ message: "amount params not defined" });
        if (reciever_account_number == undefined)
            return res.status(400).json({ message: "reciever_account_number params not defined" });
        if (+amount < 1)
            return res.status(400).json({ message: "amount too low" });
        try {
            const insufficentFunds = yield (0, utils_1.checkBalance)(res.locals.userCredential.id, amount);
            if (insufficentFunds)
                return res.status(400).json({ message: "Insufficent Balance" });
            const reciever_id = yield models_1.Wallet.query().findOne({ account_number: reciever_account_number });
            if (reciever_id == null)
                return res.status(404).json({ message: "Could not find Account holder" });
            // const code = Math.round(Math.random() * 100000)
            yield models_1.HotWireTransaction.query().insert({
                id: (0, uuid_1.v4)(),
                user_id: res.locals.userCredential.id,
                reciever: utils_1.TRANSACTION_LEVEL.TRANSFER,
                reciever_id: reciever_id.user_id,
                // otp: code,
                amount
            });
            const reciever = yield models_1.User.query().select().findById(reciever_id.user_id);
            // sendEmail(res.locals.userCredential.email, "transfer_funds", code)
            return res.status(201).json({ message: "Enter pin to complete transaction", "account_holder": `self` });
        }
        catch (err) {
            config_1.logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message);
            return res.status(500).json({ message: err.message });
        }
    }
}));
exports.transferAccount = transferAccount;
const withdrawAccount = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { complete } = req.query;
    if (complete) {
        try {
            const { pin } = req.body;
            if (pin == undefined)
                return res.status(400).json({ message: "pin params not defined" });
            // check if pin is correct
            const canWithdraw = yield bcrypt_1.default.compare((pin).toString(), res.locals.userCredential.pin);
            if (!canWithdraw)
                return res.status(400).json({ message: "incorrect pin" });
            // Get incomplete ledger transaction
            const hotWireTransaction = yield models_1.HotWireTransaction.query().select().where("status", utils_1.TRANSACTION_STATE.PENDING).where("user_id", res.locals.userCredential.id);
            const transaction = hotWireTransaction[0];
            if (transaction == undefined)
                return res.status(400).json({ message: "Invalid Transaction" });
            // Comfirm the state of the request
            // Sent response when transaction was timeout or completed
            if (transaction.status != utils_1.TRANSACTION_STATE.PENDING) {
                if (transaction.status == utils_1.TRANSACTION_STATE.TIMEOUT)
                    return res.status(400).json({ message: "Transaction Timeout" });
                else if (transaction.status == utils_1.TRANSACTION_STATE.COMPLETED)
                    return res.status(400).json({ message: "Transaction already completed" });
            }
            // Get wallet balance
            const senderAcount = yield models_1.Wallet.query().findOne("user_id", res.locals.userCredential.id);
            // Debit User 
            yield models_1.Wallet.query().findOne("user_id", res.locals.userCredential.id).patch({
                amount: senderAcount.amount - transaction.amount
            });
            // console.log(senderAcount!.amount - transaction.amount);
            // Return Success
            res.status(201).json({ message: "Withdrawal Transfer Completed" });
            // Update transaction statement
            yield models_1.HotWireTransaction.query().findById(transaction.id).patch({
                status: utils_1.TRANSACTION_STATE.COMPLETED
            });
            // Add statement for user
            yield models_1.Statement.query().insert({
                id: (0, uuid_1.v4)(),
                description: (0, utils_1.debitAlertStatement)(senderAcount.amount - transaction.amount),
                user_id: res.locals.userCredential.id
            });
        }
        catch (err) {
            config_1.logger.error(`${NAMESPACE} - WITHDRAW-MONEY`, err.message);
            return res.status(500).json({ message: err.message });
        }
    }
    else {
        try {
            const { amount } = req.body;
            if (amount == undefined)
                return res.status(400).json({ message: "amount params not defined" });
            if (+amount < 1)
                return res.status(400).json({ message: "amount too low" });
            //  Check balance
            const insufficentFunds = yield (0, utils_1.checkBalance)(res.locals.userCredential.id, amount);
            if (insufficentFunds)
                return res.status(400).json({ message: "Insufficent Balance" });
            // const code = Math.round(Math.random() * 100000)
            yield models_1.HotWireTransaction.query().insert({
                id: (0, uuid_1.v4)(),
                user_id: res.locals.userCredential.id,
                reciever: utils_1.TRANSACTION_LEVEL.WITHDRAWAL,
                reciever_id: res.locals.userCredential.id,
                // otp: code,
                amount
            });
            // sendEmail(res.locals.userCredential.email, "transfer_funds", code)
            return res.status(201).json({ message: "Enter pin to complete transaction", "account_holder": `self` });
        }
        catch (err) {
            config_1.logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message);
            return res.status(500).json({ message: err.message });
        }
    }
}));
exports.withdrawAccount = withdrawAccount;
const checkUserBalance = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    let wallet;
    try {
        if (id) {
            wallet = models_1.Wallet.query().where("user_id", res.locals.userCredential.id);
        }
        else {
            wallet = models_1.Wallet.query().findOne("user_id", res.locals.userCredential.id);
        }
        return res.status(200).json(wallet);
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}));
exports.checkUserBalance = checkUserBalance;
