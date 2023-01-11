import express, { Application } from "express"
import { apiV1 } from "../routes"
import "./contrab";
import "../database/db"

function defaultConnect() {
    const app: Application = express();
    app.use(express.json())
    app.use("/api/v1", apiV1);

    return app
}



export default defaultConnect