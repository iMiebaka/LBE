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

const creditAlertStatement = (current: string): string => (` 
Alert: CR
Balance: ${current}
`)

const debitAlertStatement = (current: string): string => (` 
Alert: DR
Balance: ${current}
`)

export { creditAlertStatement, pendingTransaction, debitAlertStatement }