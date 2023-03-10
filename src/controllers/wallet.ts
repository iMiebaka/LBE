import { Request, Response, NextFunction } from "express";
import { logger } from "../config";
import { v4 } from "uuid";
import { Statement, User, Wallet, HotWireTransaction } from "../models/";
import { checkBalance, creditAlertStatement, debitAlertStatement, clearPending, TRANSACTION_LEVEL, TRANSACTION_STATE } from "../utils";
import bcrypt from "bcrypt";


const NAMESPACE = "Wallet"

const creditAccount = (async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;

    if (amount == undefined) return res.status(400).json({ message: "amount params not defined" });
    try {
        if (+amount < 1) return res.status(400).json({ message: "Credit amount less than 1" });
        const previousAcount = await Wallet.query().select().findOne("user_id", res.locals.userCredential.id)
        
        if (previousAcount != undefined) {
            const senderBalance = +((+amount) + previousAcount.amount).toFixed(2)
            await Wallet.query().select().where("user_id", res.locals.userCredential.id).patch({
                amount: senderBalance
            })
            await Statement.query().insert({
                id: v4(),
                user_id: res.locals.userCredential.id,
                description: creditAlertStatement(amount + previousAcount.amount)
            })
            return res.status(201).json({ message: "Account Credited" })
        }
        return res.status(400).json({ message: "No transaction initiated" })
    } catch (err: any) {
        logger.error(`${NAMESPACE} - CREDIT-ACOUNT`, err.message)
        return res.status(500).json({ message: err.message });
    }
})

const transferAccount = (async (req: Request, res: Response, next: NextFunction) => {
    const { complete } = req.query;

    if (complete) {
        try {
            const { pin } = req.body;
            if (pin == undefined) return res.status(400).json({ message: "pin params not defined" });
            // check if pin is correct
            const canWithdraw = await bcrypt.compare((pin).toString(), res.locals.userCredential.pin);
            if (!canWithdraw) return res.status(400).json({ message: "incorrect pin" });
            // Get incomplete ledger transaction
            const hotWireTransaction = await HotWireTransaction.query().select().where("status", TRANSACTION_STATE.PENDING).where("user_id", res.locals.userCredential.id)
            const transaction = hotWireTransaction[0]
            if (transaction == null)
                return res.status(400).json({ message: "Invalid Transaction" })

            // Comfirm the state of the request
            // Sent response when transaction was timeout or completed
            if (transaction.status != TRANSACTION_STATE.PENDING) {
                if (transaction.status == TRANSACTION_STATE.TIMEOUT)
                    return res.status(400).json({ message: "Transaction Timeout" })
                else if (transaction.status == TRANSACTION_STATE.COMPLETED)
                    return res.status(400).json({ message: "Transaction already completed" })
            }

            // Get wallet balance
            const senderAcount = await Wallet.query().findOne("user_id", res.locals.userCredential.id)
            // Debit User 
            const senderBalance = +(senderAcount!.amount - transaction!.amount).toFixed(2)
            await Wallet.query().where("user_id", res.locals.userCredential.id).patch({
                amount: senderBalance
            })

            // Get wallet balance
            const recieverAcount = await Wallet.query().findOne("user_id", transaction.reciever_id)
            // Credit User 
            const recieverBalance = +(transaction.amount + recieverAcount!.amount).toFixed(2)
            await Wallet.query().where("user_id", transaction.reciever_id).patch({
                amount: recieverBalance
            })

            // Update transaction state
            await HotWireTransaction.query().findById(transaction.id).patch({
                status: TRANSACTION_STATE.COMPLETED
            })
            // Add statement for sender
            await Statement.query().insert({
                id: v4(),
                description: debitAlertStatement(senderBalance),
                user_id: res.locals.userCredential.id
            })
            //  Add statement for reciever
            await Statement.query().insert({
                id: v4(),
                description: creditAlertStatement(recieverBalance),
                user_id: transaction.reciever_id
            })
            // Return Success
            res.status(201).json({ message: "Transfer Completed" })
        } catch (err: any) {
            logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message)
            return res.status(500).json({ message: err.message });
        }
    }

    else {
        const { amount, reciever_account_number } = req.body;
        if (amount == undefined) return res.status(400).json({ message: "amount params not defined" });
        if (reciever_account_number == undefined) return res.status(400).json({ message: "reciever_account_number params not defined" });
        if (+amount < 1) return res.status(400).json({ message: "amount too low" });

        try {
            await clearPending(res.locals.userCredential.id)
            const insufficentFunds = await checkBalance(res.locals.userCredential.id, amount)
            if (insufficentFunds)
                return res.status(400).json({ message: "Insufficent Balance" })

            const reciever_id = await Wallet.query().findOne("account_number", reciever_account_number)
            if (reciever_id == null)
                return res.status(404).json({ message: "Could not find Account holder" })

            // const code = Math.round(Math.random() * 100000)
            await HotWireTransaction.query().insert({
                id: v4(),
                user_id: res.locals.userCredential.id,
                reciever: TRANSACTION_LEVEL.TRANSFER,
                reciever_id: reciever_id.user_id,
                // otp: code,
                amount
            })
            const reciever = await User.query().findById(reciever_id.user_id)
            // sendEmail(res.locals.userCredential.email, "transfer_funds", code)
            return res.status(201).json({ message: "Enter pin to complete transaction", "account_holder": `${reciever?.last_name} ${reciever?.first_name}` })
        } catch (err: any) {
            logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message)
            return res.status(500).json({ message: err.message });
        }
    }
})

const withdrawAccount = (async (req: Request, res: Response, next: NextFunction) => {
    const { complete } = req.query;
    if (complete) {
        try {
            const { pin } = req.body;
            if (pin == undefined) return res.status(400).json({ message: "pin params not defined" });


            // check if pin is correct
            const canWithdraw = await bcrypt.compare((pin).toString(), res.locals.userCredential.pin);
            if (!canWithdraw) return res.status(400).json({ message: "incorrect pin" });

            // Get incomplete ledger transaction
            const hotWireTransaction = await HotWireTransaction.query().select().where("status", TRANSACTION_STATE.PENDING).where("user_id", res.locals.userCredential.id)
            const transaction = hotWireTransaction[0]

            if (transaction == undefined)
                return res.status(400).json({ message: "Invalid Transaction" })

            // Comfirm the state of the request
            // Sent response when transaction was timeout or completed
            if (transaction.status != TRANSACTION_STATE.PENDING) {
                if (transaction.status == TRANSACTION_STATE.TIMEOUT)
                    return res.status(400).json({ message: "Transaction Timeout" })
                else if (transaction.status == TRANSACTION_STATE.COMPLETED)
                    return res.status(400).json({ message: "Transaction already completed" })
            }


            // Get wallet balance
            const senderAcount = await Wallet.query().findOne("user_id", res.locals.userCredential.id)
            // Debit User 
            await Wallet.query().findOne("user_id", res.locals.userCredential.id).patch({
                amount: senderAcount!.amount - transaction.amount
            })

            // Return Success
            res.status(201).json({ message: "Withdrawal Transfer Completed" })

            // Update transaction statement
            await HotWireTransaction.query().findById(transaction.id).patch({
                status: TRANSACTION_STATE.COMPLETED
            })
            // Add statement for user
            await Statement.query().insert({
                id: v4(),
                description: debitAlertStatement(senderAcount!.amount - transaction.amount),
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
            if (+amount < 1) return res.status(400).json({ message: "amount too low" });
            await clearPending(res.locals.userCredential.id)
            //  Check balance
            const insufficentFunds = await checkBalance(res.locals.userCredential.id, amount)
            if (insufficentFunds)
                return res.status(400).json({ message: "Insufficent Balance" })
            // const code = Math.round(Math.random() * 100000)
            await HotWireTransaction.query().insert({
                id: v4(),
                user_id: res.locals.userCredential.id,
                reciever: TRANSACTION_LEVEL.WITHDRAWAL,
                reciever_id: res.locals.userCredential.id,
                // otp: code,
                amount
            })
            // sendEmail(res.locals.userCredential.email, "transfer_funds", code)
            return res.status(201).json({ message: "Enter pin to complete transaction", "account_holder": `self` })
        } catch (err: any) {
            logger.error(`${NAMESPACE} - TRANSFER-MONEY`, err.message)
            return res.status(500).json({ message: err.message });
        }
    }
})

const checkUserWallet = (async (req: Request, res: Response) => {
    const { self } = req.query
    let wallet;

    try {
        if (self) {
            wallet = await User.query().select("first_name", "last_name").findById(res.locals.userCredential.id)
                .withGraphFetched("wallet_self")
        }
        else {
            wallet = await User.query().select("first_name", "last_name")
                .withGraphFetched("wallet")
        }

        return res.status(200).json(wallet)
    }
    catch (err: any) {
        return res.status(400).json({ message: err.message })
    }

})


export { creditAccount, transferAccount, withdrawAccount, checkUserWallet }