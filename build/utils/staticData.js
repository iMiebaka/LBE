"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_USER = exports.debitAlertStatement = exports.pendingTransaction = exports.creditAlertStatement = void 0;
const config_1 = require("../config");
const pendingTransaction = (otp) => (` 
Dear valued ${config_1.config.PLATFORM_NAME} user,

We have received a request for the transfer of funds. If you did not request a password reset, please ignore this email.

To complete transaction, please copy the code below:

${otp}

Thank you for using ${config_1.config.PLATFORM_NAME}.

Best regards,
The ${config_1.config.PLATFORM_NAME} Team`);
exports.pendingTransaction = pendingTransaction;
const creaditAlert = () => (` 
Dear valued ${config_1.config.PLATFORM_NAME} user,


Thank you for using ${config_1.config.PLATFORM_NAME}.

Best regards,
The ${config_1.config.PLATFORM_NAME} Team`);
const creditAlertStatement = (current) => (` 
Alert: CR
Balance: ${current}
`);
exports.creditAlertStatement = creditAlertStatement;
const debitAlertStatement = (current) => (` 
Alert: DR
Balance: ${current}
`);
exports.debitAlertStatement = debitAlertStatement;
const user1 = {
    id: "11111111-1111111-111111",
    first_name: "John",
    email: "john-doe@democredit.com",
    last_name: "Doe",
    password: "11111111",
    account: 0
};
const user2 = {
    id: "22222222-2222222-2222222",
    email: "jane-doe@democredit.com",
    first_name: "Jane",
    last_name: "Doe",
    password: "22222222",
    account: 0
};
const TEST_USER = {
    user1,
    user2,
};
exports.TEST_USER = TEST_USER;
