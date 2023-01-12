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
const supertest_1 = __importDefault(require("supertest"));
const models_1 = require("../models");
const config_1 = require("../config");
const utils_1 = require("../utils");
const user1 = utils_1.TEST_USER.user1;
const user2 = utils_1.TEST_USER.user2;
let token;
const defaultserver = (0, config_1.defaultConnect)();
describe("user", () => {
    beforeAll(() => {
    });
    describe("add user", () => {
        it("should return 201", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(defaultserver)
                .post("/api/v1/account/")
                .send(user1)
                .set("Accept", "application/json");
            expect(response.body.message).toBe("User created");
        }));
        it("should return 400", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(defaultserver)
                .post("/api/v1/account/")
                .send(user1)
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(400);
        }));
        it("should return 201", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(defaultserver)
                .post("/api/v1/account/")
                .send(user2)
                .set("Accept", "application/json");
            expect(response.body.message).toBe("User created");
        }));
        it("should return 400", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(defaultserver)
                .post("/api/v1/account/")
                .send(user2)
                .set("Accept", "application/json");
            expect(response.statusCode).toBe(400);
        }));
    });
    describe("check user", () => {
        it("user1 exist in", () => __awaiter(void 0, void 0, void 0, function* () {
            const userExist = yield models_1.User.query().findOne("email", user1.email);
            user1.id = userExist.id;
            expect(userExist.first_name).toBe(user1.first_name);
        }));
        it("user2 exist in", () => __awaiter(void 0, void 0, void 0, function* () {
            const userExist = yield models_1.User.query().findOne("email", user2.email);
            user2.id = userExist.id;
            expect(userExist.first_name).toBe(user2.first_name);
        }));
    });
    describe("login user", () => {
        it("login with invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { email: "1111", password: "1111" };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/account/")
                .send(data)
                .set("Accept", "application/json");
            console.log(response.body);
            expect(response.body.message).toBe("email does not exist");
        }));
        it("login with invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, user1), { password: "1111" });
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/account/")
                .send(data)
                .set("Accept", "application/json");
            expect(response.body.message).toBe("Incorrect password");
        }));
        it("credit account less than on", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = user1;
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/account/")
                .send(data)
                .set("Accept", "application/json");
            token = response.body.token;
            expect(response.body.message).toBe("Login successfull");
        }));
    });
    describe("checking wallet", () => {
        it("credit account", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 1000 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .post("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Account Credited");
        }));
        it("credit account less than on", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 0 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .post("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Credit amount less than 1");
        }));
    });
    describe("withdraw wallet", () => {
        it("withdrawal less than 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 0 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("amount too low");
        }));
        it("withdraw exact balance", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 1000 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Insufficent Balance");
        }));
        it("successfull withdrawal (start)", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 100 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Enter pin to complete transaction");
        }));
        it("successfull withdrawal (finish)", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { pin: 1234 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Withdrawal Transfer Completed");
        }));
    });
    describe("withdraw funds", () => {
        it("withdrawal less than 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 0 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("amount too low");
        }));
        it("withdraw exact balance", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 1000 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Insufficent Balance");
        }));
        it("successfull withdrawal (start)", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 100 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Enter pin to complete transaction");
        }));
        it("successfull withdrawal with wrong pin (finish)", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { pin: 12344 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("incorrect pin");
        }));
        it("successfull withdrawal (finish)", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { pin: 1234 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .put("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Withdrawal Transfer Completed");
        }));
    });
    describe("transfer funds", () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const walletOne = yield models_1.Wallet.query().findOne("user_id", user1.id);
            user1.account = walletOne.account_number;
            const walletTwo = yield models_1.Wallet.query().findOne("user_id", user2.id);
            user2.account = walletTwo.account_number;
        }));
        it("transfer less than 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 0, reciever_account_number: user2.account };
            const response = yield (0, supertest_1.default)(defaultserver)
                .patch("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("amount too low");
        }));
        it("transfer exact balance", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 1000, reciever_account_number: user2.account };
            const response = yield (0, supertest_1.default)(defaultserver)
                .patch("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Insufficent Balance");
        }));
        it("successfull transfer (start)", () => __awaiter(void 0, void 0, void 0, function* () {
            const transaction = { amount: 100, reciever_account_number: user2.account };
            const response = yield (0, supertest_1.default)(defaultserver)
                .patch("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Enter pin to complete transaction");
        }));
        it("successfull transfer with wrong pin (finish)", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { pin: 12344 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .patch("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("incorrect pin");
        }));
        it("successfull transfer (finish)", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { pin: 1234 };
            const response = yield (0, supertest_1.default)(defaultserver)
                .patch("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.message).toBe("Transfer Completed");
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.HotWireTransaction.query().where("user_id", user1.id).delete();
        yield models_1.HotWireTransaction.query().where("user_id", user2.id).delete();
        yield models_1.Wallet.query().where("user_id", user1.id).delete();
        yield models_1.Wallet.query().where("user_id", user2.id).delete();
        yield models_1.Statement.query().where("user_id", user1.id).delete();
        yield models_1.Statement.query().where("user_id", user2.id).delete();
        yield models_1.User.query().deleteById(user1.id);
        yield models_1.User.query().deleteById(user2.id);
    }));
});
