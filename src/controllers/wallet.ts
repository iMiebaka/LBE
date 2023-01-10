import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { config, logger, sendEmail } from "../config";
import { v4 } from "uuid";
import { Statement, User, Wallet } from "../models/";
import { checkBalance, checkUser, creditAlertStatement, TRANSACTION_LEVEL, TRANSACTION_STATE } from "../utils";
import HotData from "../models/HotData";
import { debitAlertStatement, pendingTransaction } from "../utils/staticData";


const NAMESPACE = "Wallet"

const creditAccount = (async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;

    if (amount == undefined) return res.status(400).json({ message: "amount params not defined" });
    try {
        const previousAcount = await Wallet.query().select().where("user_id", res.locals.userCredential.id)

        await Wallet.query().select().where("user_id", res.locals.userCredential.id).patch({
            amount: amount + previousAcount[0].amount
        })
        await Statement.query().insert({
            id: v4(),
            user_id: res.locals.userCredential.id,
            description: creditAlertStatement(amount + previousAcount[0].amount)
        })
        return res.status(201).json({ message: "Account Credited" })
    } catch (err: any) {
        logger.error(`${NAMESPACE} - CREDIT-ACOUNT`, err.message)
        return res.status(500).json({ message: err.message });
    }
})

const transferAccount = (async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.query;
    const { amount, reciever_account_number } = req.body;
    if (amount == undefined) return res.status(400).json({ message: "amount params not defined" });
    if (reciever_account_number == undefined) return res.status(400).json({ message: "reciever_account_number params not defined" });

    if (otp !== undefined) {
        try {

            // Check if account is sufficent
            const insufficentFunds = await checkBalance(res.locals.userCredential.id, parseFloat(amount))
            if (insufficentFunds)
                return res.status(400).json({ message: "Insufficent Balance" })
            // Get incomplet ledger transaction
            const hotData = await HotData.query().select().where("otp", +otp).where("user_id", res.locals.userCredential.id)
            if (hotData.length == 0)
                return res.status(400).json({ message: "Invalid Transaction" })

            // Comfirm the state of the request
            // Sent response when transaction was timeout or completed
            if (hotData[0].status != TRANSACTION_STATE.PENDING) {
                if (hotData[0].status == TRANSACTION_STATE.TIMEOUT)
                    return res.status(400).json({ message: "Transaction Timeout" })
                else if (hotData[0].status == TRANSACTION_STATE.COMPLETED)
                    return res.status(400).json({ message: "Transaction already completed" })

            }

            // Get wallet balance
            const senderAcount = await Wallet.query().select().where("user_id", res.locals.userCredential.id)
            // Debit User 
            await Wallet.query().select().where("user_id", res.locals.userCredential.id).patch({
                amount: senderAcount[0].amount - parseFloat(amount)
            })

            // Get wallet balance
            const recieverAcount = await Wallet.query().select().where("user_id", hotData[0].reciever_id)
            // Credit User 
            await Wallet.query().select().where("user_id", hotData[0].reciever_id).patch({
                amount: parseFloat(amount) + recieverAcount[0].amount
            })
            // Return Success
            res.status(201).json({ message: "Transfer Completed" })

            // Update transaction state
            await HotData.query().select().findById(hotData[0].id).patch({
                status: TRANSACTION_STATE.COMPLETED
            })
            // Add statement for sender
            await Statement.query().insert({
                id: v4(),
                description: debitAlertStatement(amount + hotData[0].amount),
                user_id: res.locals.userCredential.id
            })
            //  Add statement for reciever
            await Statement.query().insert({
                id: v4(),
                description: creditAlertStatement(amount + hotData[0].amount),
                user_id: hotData[0].reciever_id
            })
        } catch (err: any) {
            logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message)
            return res.status(500).json({ message: err.message });
        }
    }

    else {

        try {
            const insufficentFunds = await checkBalance(res.locals.userCredential.id, amount)
            if (insufficentFunds)
                return res.status(400).json({ message: "Insufficent Balance" })

            const reciever_id = await Wallet.query().select().where({ account_number: reciever_account_number })
            if (reciever_id.length == 0)
                return res.status(404).json({ message: "Could not find Account holder" })

            const code = Math.round(Math.random() * 100000)
            await HotData.query().insert({
                id: v4(),
                user_id: res.locals.userCredential.id,
                reciever: TRANSACTION_LEVEL.TRANSFER,
                reciever_id: reciever_id[0].user_id,
                otp: code,
                amount
            })
            const reciever = await User.query().select().findById(reciever_id[0].user_id)
            sendEmail(res.locals.userCredential.email, "transfer_funds", code)
            return res.status(201).json({ message: "OTP sent to email", hint: "Send otp as header to complete transaction", "account_holder": `${reciever?.first_name} ${reciever?.last_name}` })
        } catch (err: any) {
            logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message)
            return res.status(500).json({ message: err.message });
        }
    }
})

const withdrawAccount = (async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.query;
    if (otp !== undefined) {
        try {
            // Get incomplet ledger transaction
            const hotData = await HotData.query().select().findOne("otp", +otp).where("user_id", res.locals.userCredential.id)
            if (hotData == undefined)
                return res.status(400).json({ message: "Invalid Transaction" })

            // Comfirm the state of the request
            // Sent response when transaction was timeout or completed
            if (hotData.status != TRANSACTION_STATE.PENDING) {
                if (hotData.status == TRANSACTION_STATE.TIMEOUT)
                    return res.status(400).json({ message: "Transaction Timeout" })
                else if (hotData.status == TRANSACTION_STATE.COMPLETED)
                    return res.status(400).json({ message: "Transaction already completed" })
            }


            // Get wallet balance
            const senderAcount = await Wallet.query().findOne("user_id", res.locals.userCredential.id)
            // Debit User 
            await Wallet.query().findOne("user_id", res.locals.userCredential.id).patch({
                amount: senderAcount!.amount - (hotData.amount)
            })
            console.log(senderAcount!.amount - (hotData.amount));

            // Return Success
            res.status(201).json({ message: "Withdrawal Transfer Completed" })

            // Update transaction statement
            await HotData.query().findById(hotData.id).patch({
                status: TRANSACTION_STATE.COMPLETED
            })
            // Add statement for user
            await Statement.query().insert({
                id: v4(),
                description: debitAlertStatement(senderAcount!.amount - hotData.amount),
                user_id: res.locals.userCredential.id
            })
        } catch (err: any) {
            logger.error(`${NAMESPACE} - WITHDRAW-MONEY`, err.message)
            return res.status(500).json({ message: err.message });
        }
    }

    else {

        try {
            const { amount } = req.body;
            if (amount == undefined) return res.status(400).json({ message: "amount params not defined" });

            const insufficentFunds = await checkBalance(res.locals.userCredential.id, amount)
            if (insufficentFunds)
                return res.status(400).json({ message: "Insufficent Balance" })
            const code = Math.round(Math.random() * 100000)
            await HotData.query().insert({
                id: v4(),
                user_id: res.locals.userCredential.id,
                reciever: TRANSACTION_LEVEL.WITHDRAWAL,
                reciever_id: res.locals.userCredential.id,
                otp: code,
                amount
            })
            sendEmail(res.locals.userCredential.email, "transfer_funds", code)
            return res.status(201).json({ message: "OTP sent to email", hint: "Send otp as header to complete transaction", "account_holder": `self` })
        } catch (err: any) {
            logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message)
            return res.status(500).json({ message: err.message });
        }
    }
})


export { creditAccount, transferAccount, withdrawAccount }