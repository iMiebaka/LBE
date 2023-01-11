import initDB from "./database/db"
import { config, logger, defaultConnect } from "./config";

const NAMESPACE = "Server"

const app = defaultConnect()

// Server listening to port of God's knows what
app.listen(config.server.PORT, () => {
    initDB.raw('SELECT 1 + 1 AS result')
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