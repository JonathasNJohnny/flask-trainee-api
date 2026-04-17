const COLLECTION_NAME = "students";

const STUDENT_SCHEMA = {
  bsonType: "object",
  required: ["name", "email", "password_hash", "date_of_birth", "created_at"],
  additionalProperties: false,
  properties: {
    _id: {},
    name: { bsonType: "string" },
    email: { bsonType: "string" },
    password_hash: { bsonType: "string" },
    date_of_birth: { bsonType: "string" },
    created_at: { bsonType: "string" },
    phone: { bsonType: "string" },
    github_url: { bsonType: "string" },
    linkedin_url: { bsonType: "string" },
    portfolio_url: { bsonType: "string" },
    pfp_url: { bsonType: "string" },
  },
};

const createStudentsCollection = async (db) => {
  const collectionExists = await db
    .listCollections({ name: COLLECTION_NAME }, { nameOnly: true })
    .hasNext();

  if (!collectionExists) {
    await db.createCollection(COLLECTION_NAME, {
      validator: { $jsonSchema: STUDENT_SCHEMA },
      validationLevel: "strict",
      validationAction: "error",
    });
  } else {
    await db.command({
      collMod: COLLECTION_NAME,
      validator: { $jsonSchema: STUDENT_SCHEMA },
      validationLevel: "strict",
      validationAction: "error",
    });
  }

  await db
    .collection(COLLECTION_NAME)
    .createIndex({ email: 1 }, { unique: true });
};

export const migration001CreateStudentsCollection = {
  id: "001-create-students-collection",
  up: createStudentsCollection,
};
