import { Wallet, User } from "../models";

import { config } from "../config"
import { creditAlertStatement, TEST_USER } from "./staticData";


const TRANSACTION_LEVEL = {
    TRANSFER: "TRANSFER",
    WITHDRAWAL: "WITHDRAWAL"
}


const TRANSACTION_STATE = {
    PENDING: "PENDING",
    TIMEOUT: "TIMEOUT",
    COMPLETED: "COMPLETED"
}
const checkBalance = async (user: any, amount: number) => {
    const userInit = await Wallet.query().where("user_id", user)
    return calcultateIntrest(amount, userInit[0].amount)

}

const checkUser = async (user: any, type: string) => {
    return await User.query().where(type, user)
}


const calcultateIntrest = (amount: number, total: number) => {
    return amount + ((config.COMMISSION / 100) * total) > total
}

export {
    checkBalance, checkUser,
    creditAlertStatement,
    TRANSACTION_LEVEL,
    TRANSACTION_STATE,
    TEST_USER
}