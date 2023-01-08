npm i
npm run build
knex migrate:make knex_migrations
knex migrate:latest