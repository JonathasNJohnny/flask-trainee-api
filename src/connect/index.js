import { promises as fs } from "fs";
import path from "path";

const FAKE_DB_PATH = path.resolve(process.cwd(), "src", "fakedb.txt");

const createEmptyDb = () => ({
  users: [],
});

const ensureDbFile = async () => {
  await fs.mkdir(path.dirname(FAKE_DB_PATH), { recursive: true });

  try {
    await fs.access(FAKE_DB_PATH);
  } catch {
    await fs.writeFile(
      FAKE_DB_PATH,
      JSON.stringify(createEmptyDb(), null, 2),
      "utf-8",
    );
  }
};

const readDb = async () => {
  await ensureDbFile();

  const content = await fs.readFile(FAKE_DB_PATH, "utf-8");

  if (!content.trim()) {
    const emptyDb = createEmptyDb();
    await fs.writeFile(FAKE_DB_PATH, JSON.stringify(emptyDb, null, 2), "utf-8");
    return emptyDb;
  }

  try {
    const parsed = JSON.parse(content);

    if (!parsed || typeof parsed !== "object") {
      const emptyDb = createEmptyDb();
      await fs.writeFile(
        FAKE_DB_PATH,
        JSON.stringify(emptyDb, null, 2),
        "utf-8",
      );
      return emptyDb;
    }

    return parsed;
  } catch {
    const emptyDb = createEmptyDb();
    await fs.writeFile(FAKE_DB_PATH, JSON.stringify(emptyDb, null, 2), "utf-8");
    return emptyDb;
  }
};

const writeDb = async (db) => {
  await ensureDbFile();
  await fs.writeFile(FAKE_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
};

const readTable = async (tableName) => {
  const db = await readDb();
  const table = db[tableName];

  return Array.isArray(table) ? table : [];
};

const writeTable = async (tableName, items) => {
  const db = await readDb();
  db[tableName] = Array.isArray(items) ? items : [];
  await writeDb(db);
};

export const connect = {
  readTable,
  writeTable,
};
