import express, { Application, Request, Response } from "express"
import cors from "cors";
import "dotenv/config";
import initDB from "./database/db"
import { config, logger } from "./config";



const NAMESPACE = "Server"

const app: Application = express();
app.use(cors());
app.use(express.json());


app.get("/", (req:Request, res:Response) => {
    res.redirect("https://documenter.getpostman.com/view/22454995/2s8Z76vp4J")
})

// Route Setup
import { apiV1 } from "./routes/";

app.use("/api/v1", apiV1);


// Server listening to port of God's knows what
app.listen(config.server.PORT, async () => {
    await initDB.raw('SELECT 1 + 1 AS result')
        .then((result) => {
            logger.info("Database", "Database Connected and open for business 🛢️");
            logger.info(NAMESPACE, `REST API is Running on ${config.server.PORT} 🌐`);
            app.set("LISTENING", config.server.PORT);
        })
        .catch((error) => {
            logger.error("Database", `Error connecting to database: ${error}`);
            logger.error(NAMESPACE, `Server failed to start 😞`);
        });


});

export default app