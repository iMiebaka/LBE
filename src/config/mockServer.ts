import express, { Application, Request, Response } from "express"
import { apiV1 } from "../routes"

function defaultConnect() {
    const app = express()
    app.use(express.json())
    app.use("/api/v1", apiV1);
    return app
}

const MOCK_SERVER = {
    defaultConnect
}

export default MOCK_SERVER