import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { ServiceError } from "infra/errors";

async function runnerMigration(migrationsOptions) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dbClient,
      dir: resolve("infra", "migrations"),
      direction: "up",
      log: () => {},
      migrationsTable: "pgmigrations",
      ...migrationsOptions,
    });
    return migrations;
  } catch (error) {
    const migratorError = new ServiceError(
      error,
      "An error occurred in the migration service.",
    );
    throw migratorError;
  } finally {
    await dbClient?.end();
  }
}

async function listPendingMigrations() {
  return runnerMigration({ dryRun: true });
}

async function runPendingMigrations() {
  return runnerMigration({ dryRun: false });
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
