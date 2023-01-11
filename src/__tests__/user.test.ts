import request from "supertest"
import { HotWireTransaction, Statement, User, Wallet } from "../models"
import { defaultConnect } from "../config"
import knex from "knex"
import { after } from "node:test"





const user1 = {
    id: "11111111-1111111-111111",
    first_name: "John",
    email: "john-doe@democredit.com",
    last_name: "Doe",
    password: "11111111",
    account: ""
}

const user2 = {
    id: "22222222-2222222-2222222",
    email: "jane-doe@democredit.com",
    first_name: "Jane",
    last_name: "Doe",
    password: "22222222",
    account: ""
}


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


    describe("transfer funds", () => {
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

