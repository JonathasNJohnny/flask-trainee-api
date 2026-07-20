import type { Db } from "mongodb";

const COLLECTION_NAME = "enterprises";

const ENTERPRISE_SCHEMA = {
  bsonType: "object",
  required: [
    "company_name",
    "cnpj",
    "email",
    "password_hash",
    "company_start_date",
    "created_at",
  ],
  additionalProperties: false,
  properties: {
    _id: {},
    company_name: { bsonType: "string" },
    cnpj: { bsonType: "string" },
    email: { bsonType: "string" },
    password_hash: { bsonType: "string" },
    company_start_date: { bsonType: "string" },
    created_at: { bsonType: "string" },
    phone: { bsonType: "string" },
    website_url: { bsonType: "string" },
  },
};

const createEnterprisesCollection = async (db: Db): Promise<void> => {
  const collectionExists = await db
    .listCollections({ name: COLLECTION_NAME }, { nameOnly: true })
    .hasNext();

  if (!collectionExists) {
    await db.createCollection(COLLECTION_NAME, {
      validator: { $jsonSchema: ENTERPRISE_SCHEMA },
      validationLevel: "strict",
      validationAction: "error",
    });
  } else {
    await db.command({
      collMod: COLLECTION_NAME,
      validator: { $jsonSchema: ENTERPRISE_SCHEMA },
      validationLevel: "strict",
      validationAction: "error",
    });
  }

  await db
    .collection(COLLECTION_NAME)
    .createIndex({ email: 1 }, { unique: true });

  await db
    .collection(COLLECTION_NAME)
    .createIndex({ cnpj: 1 }, { unique: true });
};

export const migration002CreateEnterprisesCollection = {
  id: "002-create-enterprises-collection",
  up: createEnterprisesCollection,
};
