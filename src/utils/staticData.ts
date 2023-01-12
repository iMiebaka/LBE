import { config } from "../config";

const pendingTransaction = (otp: number): string => (` 
Dear valued ${config.PLATFORM_NAME} user,

We have received a request for the transfer of funds. If you did not request a password reset, please ignore this email.

To complete transaction, please copy the code below:

${otp}

Thank you for using ${config.PLATFORM_NAME}.

Best regards,
The ${config.PLATFORM_NAME} Team`)



const creaditAlert = (): string => (` 
Dear valued ${config.PLATFORM_NAME} user,


Thank you for using ${config.PLATFORM_NAME}.

Best regards,
The ${config.PLATFORM_NAME} Team`)

const creditAlertStatement = (current: number): string => (` 
Alert: CR
Balance: ${current}
`)

const debitAlertStatement = (current: number): string => (` 
Alert: DR
Balance: ${current}
`)

const user1 = {
    id: "11111111-1111111-111111",
    first_name: "John",
    email: "john-doe@democredit.com",
    last_name: "Doe",
    password: "11111111",
    account: 0
}

const user2 = {
    id: "22222222-2222222-2222222",
    email: "jane-doe@democredit.com",
    first_name: "Jane",
    last_name: "Doe",
    password: "22222222",
    account: 0
}
const TEST_USER = {
    user1,
    user2,
}

export { creditAlertStatement, pendingTransaction, debitAlertStatement, TEST_USER }