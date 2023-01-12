import request from "supertest"
import { HotWireTransaction, Statement, User, Wallet } from "../models"
import { defaultConnect } from "../config"
import { TEST_USER } from "../utils"



const user1 = TEST_USER.user1
const user2 = TEST_USER.user2


let token: string;

const defaultserver = defaultConnect()


describe("user", () => {
    beforeAll(() => {

    })
    describe("add user", () => {
        it("should return 201", async () => {
            const response = await request(defaultserver)
                .post("/api/v1/account/")
                .send(user1)
                .set("Accept", "application/json")
            expect(response.body.message).toBe("User created");
        })
        it("should return 400", async () => {
            const response = await request(defaultserver)
                .post("/api/v1/account/")
                .send(user1)
                .set("Accept", "application/json")
            expect(response.statusCode).toBe(400);
        })

        it("should return 201", async () => {
            const response = await request(defaultserver)
                .post("/api/v1/account/")
                .send(user2)
                .set("Accept", "application/json")
            expect(response.body.message).toBe("User created");
        })

        it("should return 400", async () => {
            const response = await request(defaultserver)
                .post("/api/v1/account/")
                .send(user2)
                .set("Accept", "application/json")
            expect(response.statusCode).toBe(400);
        })
    })


    describe("check user", () => {
        it("user1 exist in", async () => {
            const userExist = await User.query().findOne("email", user1.email)
            user1.id = userExist!.id
            expect(userExist!.first_name).toBe(user1.first_name)
        })
        it("user2 exist in", async () => {
            const userExist = await User.query().findOne("email", user2.email)
            user2.id = userExist!.id
            expect(userExist!.first_name).toBe(user2.first_name)
        })
    })

    describe("login user", () => {
        it("login with invalid email", async () => {
            const data = { email: "1111", password: "1111" }
            const response = await request(defaultserver)
                .put("/api/v1/account/")
                .send(data)
                .set("Accept", "application/json")
            console.log(response.body);

            expect(response.body.message).toBe("email does not exist");
        })

        it("login with invalid password", async () => {
            const data = { ...user1, password: "1111" }
            const response = await request(defaultserver)
                .put("/api/v1/account/")
                .send(data)
                .set("Accept", "application/json")
            expect(response.body.message).toBe("Incorrect password");
        })

        it("credit account less than on", async () => {
            const data = user1
            const response = await request(defaultserver)
                .put("/api/v1/account/")
                .send(data)
                .set("Accept", "application/json")
            token = response.body.token
            expect(response.body.message).toBe("Login successfull");
        })
    })


    describe("checking wallet", () => {
        it("credit account", async () => {
            const transaction = { amount: 1000 }
            const response = await request(defaultserver)
                .post("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Account Credited");
        })

        it("credit account less than on", async () => {
            const transaction = { amount: 0 }
            const response = await request(defaultserver)
                .post("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Credit amount less than 1");
        })
    })



    describe("withdraw wallet", () => {
        it("withdrawal less than 1", async () => {
            const transaction = { amount: 0 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("amount too low");
        })

        it("withdraw exact balance", async () => {
            const transaction = { amount: 1000 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Insufficent Balance");
        })

        it("successfull withdrawal (start)", async () => {
            const transaction = { amount: 100 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Enter pin to complete transaction");
        })

        it("successfull withdrawal (finish)", async () => {
            const data = { pin: 1234 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Withdrawal Transfer Completed");
        })
    })


    describe("withdraw funds", () => {
        it("withdrawal less than 1", async () => {
            const transaction = { amount: 0 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("amount too low");
        })

        it("withdraw exact balance", async () => {
            const transaction = { amount: 1000 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Insufficent Balance");
        })

        it("successfull withdrawal (start)", async () => {
            const transaction = { amount: 100 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Enter pin to complete transaction");
        })

        it("successfull withdrawal with wrong pin (finish)", async () => {
            const data = { pin: 12344 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("incorrect pin");
        })
        it("successfull withdrawal (finish)", async () => {
            const data = { pin: 1234 }
            const response = await request(defaultserver)
                .put("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Withdrawal Transfer Completed");
        })
    })

    describe("transfer funds", () => {
        beforeAll(async () => {
            const walletOne = await Wallet.query().findOne("user_id", user1.id)
            user1.account = walletOne!.account_number
            const walletTwo = await Wallet.query().findOne("user_id", user2.id)
            user2.account = walletTwo!.account_number
        })
        it("transfer less than 1", async () => {
            const transaction = { amount: 0, reciever_account_number: user2.account }
            const response = await request(defaultserver)
                .patch("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("amount too low");
        })

        it("transfer exact balance", async () => {
            const transaction = { amount: 1000, reciever_account_number: user2.account }
            const response = await request(defaultserver)
                .patch("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Insufficent Balance");
        })

        it("successfull transfer (start)", async () => {
            const transaction = { amount: 100, reciever_account_number: user2.account }
            const response = await request(defaultserver)
                .patch("/api/v1/transaction/")
                .send(transaction)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Enter pin to complete transaction");
        })

        it("successfull transfer with wrong pin (finish)", async () => {
            const data = { pin: 12344 }
            const response = await request(defaultserver)
                .patch("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("incorrect pin");
        })
        it("successfull transfer (finish)", async () => {
            const data = { pin: 1234 }
            const response = await request(defaultserver)
                .patch("/api/v1/transaction?complete=true")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("Transfer Completed");
        })
    })
    describe("logout", () => {
        it("logout user", async () => {
            const response = await request(defaultserver)
                .get("/api/v1/logout")
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${token}`)
            expect(response.body.message).toBe("logout");
        })
    })


    afterAll(async () => {
        await HotWireTransaction.query().where("user_id", user1.id).delete()
        await HotWireTransaction.query().where("user_id", user2.id).delete()
        await Wallet.query().where("user_id", user1.id).delete()
        await Wallet.query().where("user_id", user2.id).delete()
        await Statement.query().where("user_id", user1.id).delete()
        await Statement.query().where("user_id", user2.id).delete()
        await User.query().deleteById(user1.id)
        await User.query().deleteById(user2.id)
    })
})

