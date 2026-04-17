import { connect } from "../../connect/index.js";

const readUsers = async () => {
  return connect.readTable("users");
};

const writeUsers = async (users) => {
  await connect.writeTable("users", users);
};

const findByEmail = async (email) => {
  const users = await readUsers();
  return users.find((user) => user.email === email) || null;
};

const create = async (userData) => {
  const users = await readUsers();
  users.push(userData);
  await writeUsers(users);

  return userData;
};

export const userRepository = {
  findByEmail,
  create,
};
