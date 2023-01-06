import knex from "./init"

knex.migrate.latest()
  .then(() => {
    console.log('Migration complete.');
    knex.destroy();
  })
  .catch((err) => {
    console.error(err);
    knex.destroy();
  });

export default knex