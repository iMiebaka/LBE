import { Knex } from 'knex';
import "dotenv/config"
import { config } from '../config';

interface IKnexConfig {
  [key: string]: Knex.Config;
}

const configs: IKnexConfig = {
  development: {
    // client: 'mysql2',
    // connection: {
    //   host: "localhost",
    //   user: "root",
    //   password: "MYSQL_ROOT_PASSWORD",
    //   database: "DemoCreditDB",
    //   port: parseInt(process.env.DATABASE_PORT || "9906")
    // },
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
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

export default configs;
