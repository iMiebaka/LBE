import request from "supertest"
import { User } from "../models"
import { MOCK_SERVER } from "../config"
import { Express } from 'express';





const user1 = {
    id: "11111111-1111111-111111",
    first_name: "John",
    email: "john-doe@democredit.com",
    last_name: "Doe",
    password: "11111111"
}

const user2 = {
    id: "22222222-2222222-2222222",
    email: "jane-doe@democredit.com",
    first_name: "Jane",
    last_name: "Doe",
    password: "22222222"
}


let token;

const defaultserver = MOCK_SERVER.defaultConnect()


describe.skip("user", () => {
    describe("add user", () => {
        it("should return 201", async () => {
            const response = await request(defaultserver)
                .post("/api/v1/account/")
                .send(user1)
                .set("Accept", "application/json")
            expect(typeof response.statusCode).toBe(201);
        })
        it("should return 400", async () => {
            const response = await request(defaultserver)
                .post("/api/v1/account/")
                .send(user1)
                .set("Accept", "application/json")
            expect(typeof response.statusCode).toBe(400);
        })

        it("should return 201", async () => {
            const response = await request(defaultserver)
                .post("/api/v1/account/")
                .send(user2)
                .set("Accept", "application/json")
            expect(typeof response.statusCode).toBe(201);
        })

        it("should return 400", async () => {
            const response = await request(defaultserver)
                .post("/api/v1/account/")
                .send(user2)
                .set("Accept", "application/json")
            expect(typeof response.statusCode).toBe(400);
        })
    })


    describe("check user", () => {
        it("user1 is signed in", async () => {
            const userExist = await User.query().findOne("email", user1.email)
            expect(userExist).toBe(Object)
        })
        it("user2 is signed in", async () => {
            const userExist = await User.query().findOne("email", user2.email)
            expect(userExist).toBe(Object)
        })
    })
})

