import { Knex } from 'knex';
import "dotenv/config"

interface IKnexConfig {
  [key: string]: Knex.Config;
}

const configs: IKnexConfig = {
  // development: {
  //   client: process.env.CLIENT,
  //   connection: {
  //     filename: process.env.FILEPATH as string,
  //   },
  //   debug: !!process.env.DB_DEBUG,
  //   useNullAsDefault: true,
  // },
  development: {
    client: 'mysql2',
    connection: {
      host: "localhost",
      user: "root",
      password: "MYSQL_ROOT_PASSWORD",
      database: "DemoCreditDB",
      port: parseInt(process.env.DATABASE_PORT || "9906")
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
