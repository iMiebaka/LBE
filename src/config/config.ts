import "dotenv/config"

const DATABASE_CLIENT = process.env.DATABASE_CLIENT || "mysql"
const DATABASE_HOST = process.env.DATABASE_HOST || "127.0.0.1"
const DATABASE_USER = process.env.DATABASE_USER || "your_database_user"
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "your_database_password"
const DATABASE_NAME = process.env.DATABASE_NAME || "DemoCreditDB"
const DATABASE_PORT = process.env.DATABASE_PORT || "8080"

const PORT = process.env.PORT || 5100;
const RUNTIME = process.env.RUNTIME || "development";


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
    RUNTIME
}

export default config