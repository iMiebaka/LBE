"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const DATABASE_CLIENT = process.env.DATABASE_CLIENT || "mysql2";
const DATABASE_HOST = process.env.DATABASE_HOST || "127.0.0.1";
const DATABASE_USER = process.env.DATABASE_USER || "your_database_user";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "*********";
const DATABASE_NAME = process.env.DATABASE_NAME || "DemoCreditDB";
const DATABASE_PORT = parseInt(process.env.DATABASE_PORT || "33060");
const SECRET_KEY = process.env.SECRET_KEY || "na-only-you-waka-come";
const PORT = process.env.PORT || 5100;
const RUNTIME = process.env.NODE_ENV || "development";
const config = {
    database: {
        DATABASE_CLIENT,
        DATABASE_HOST,
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_NAME,
        DATABASE_PORT
    },
    server: {
        PORT
    },
    PLATFORM_NAME: 'Demo Credit',
    RUNTIME,
    SECRET_KEY,
    COMMISSION: 2
};
exports.default = config;
