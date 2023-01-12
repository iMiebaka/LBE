"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./database/db"));
const config_1 = require("./config");
const NAMESPACE = "Server";
const app = (0, config_1.defaultConnect)();
// Server listening to port of God's knows what
app.listen(config_1.config.server.PORT, () => {
    db_1.default.raw('SELECT 1 + 1 AS result')
        .then((result) => {
        config_1.logger.info("Database", "Database Connected and open for business 🛢️");
        config_1.logger.info(NAMESPACE, `REST API is Running on ${config_1.config.server.PORT} 🌐`);
        app.set("LISTENING", config_1.config.server.PORT);
    })
        .catch((error) => {
        config_1.logger.error("Database", `Error connecting to database: ${error}`);
        config_1.logger.error(NAMESPACE, `Server failed to start 😞`);
    });
});
exports.default = app;
