import { connect } from "../../connect/index.js";

const getUsersCollection = async () => {
  const db = await connect.getDb();
  return db.collection("users");
};

const findByEmail = async (email) => {
  const usersCollection = await getUsersCollection();
  return usersCollection.findOne({ email });
};

const create = async (userData) => {
  const usersCollection = await getUsersCollection();
  await usersCollection.insertOne(userData);
  return userData;
};

export const userRepository = {
  findByEmail,
  create,
};
