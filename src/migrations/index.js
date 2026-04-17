import { migration001CreateStudentsCollection } from "./001-create-users-collection.js";
import { connect } from "../connect/index.js";

const MIGRATIONS = [migration001CreateStudentsCollection];

const MIGRATIONS_COLLECTION = "_migrations";

const runMigrations = async () => {
  const db = await connect.getDb();
  const migrationsCollection = db.collection(MIGRATIONS_COLLECTION);

  await migrationsCollection.createIndex({ id: 1 }, { unique: true });

  const appliedMigrations = await migrationsCollection
    .find({}, { projection: { id: 1, _id: 0 } })
    .toArray();

  const appliedIds = new Set(appliedMigrations.map((item) => item.id));

  for (const migration of MIGRATIONS) {
    if (appliedIds.has(migration.id)) {
      continue;
    }

    await migration.up(db);

    await migrationsCollection.insertOne({
      id: migration.id,
      appliedAt: new Date().toISOString(),
    });
  }
};

export const migrations = {
  runMigrations,
};
