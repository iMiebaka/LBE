import express, { Application } from "express"
import cors from "cors";
import "dotenv/config";
import initDB from "./models"
import { config, logger } from "./config";



const NAMESPACE = "Server"

const app: Application = express();
app.use(cors());
app.use(express.json());


// Route Setup
// import { apiV1 } from "./routes/";

// app.use("/api/v1", apiV1);


// Server listening to port of God's knows what
app.listen(config.server.PORT, async () => {
    initDB.raw('SELECT 1 + 1 AS result')
        .then((result) => {
            logger.info("Database", "Database Connected and open for business 🛢️");
            try {
                logger.info(NAMESPACE, `REST API is Running on ${config.server.PORT} 🌐`);
                app.set("LISTENING", config.server.PORT);
            }
            catch (error) {
                logger.info(NAMESPACE, `Server failed to start 😞`);
            }
        })
        .catch((error) => {
            logger.error("Database", `Error connecting to database: ${error}`);
        });


});

// module.exports = app