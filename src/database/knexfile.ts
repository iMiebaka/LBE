import { Knex } from 'knex';
import { config } from '../config';

interface IKnexConfig {
  [key: string]: Knex.Config;
}

const configs: IKnexConfig = {
  development: {
    client: config.database.DATABASE_CLIENT,
    connection: {
      host: config.database.DATABASE_HOST,
      user: config.database.DATABASE_USER,
      password: config.database.DATABASE_PASSWORD,
      database: config.database.DATABASE_NAME,
      port: config.database.DATABASE_PORT
    },
    pool: {
      min: 0,
      max: 6,
    },
    debug: true,
    migrations: {
      tableName: "knex_migrations"
    }
  },
  test: {
    client: config.database.DATABASE_CLIENT,
    connection: {
      host: config.database.DATABASE_HOST,
      user: config.database.DATABASE_USER,
      password: config.database.DATABASE_PASSWORD,
      database: config.database.DATABASE_NAME + "_TEST",
      port: config.database.DATABASE_PORT
    },
    pool: {
      min: 0,
      max: 6,
    },
    debug: true,
    migrations: {
      tableName: "knex_migrations"
    }
  },
  staging: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3"
    }
  },

  production: {
    connection: {
      host: config.database.DATABASE_HOST,
      user: config.database.DATABASE_USER,
      password: config.database.DATABASE_PASSWORD,
      database: config.database.DATABASE_NAME,
      port: config.database.DATABASE_PORT
    },
    pool: {
      min: 0,
      max: 6,
    },
    debug: true,
    migrations: {
      tableName: "knex_migrations"
    }
  }
};

export default configs;
