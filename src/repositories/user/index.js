import { connect } from "../../connect/index.js";

const getStudentsCollection = async () => {
  return connect.getCollection("students", { mustExist: true });
};

const findByEmail = async (email) => {
  const studentsCollection = await getStudentsCollection();
  return studentsCollection.findOne({ email });
};

const create = async (userData) => {
  const studentsCollection = await getStudentsCollection();

  try {
    const result = await studentsCollection.insertOne(userData);
    return {
      ...userData,
      _id: result.insertedId,
    };
  } catch (error) {
    if (error?.code === 11000) {
      const conflictError = new Error("Ja existe usuario com esse email");
      conflictError.status = 409;
      throw conflictError;
    }

    if (error?.code === 121) {
      const schemaError = new Error(
        "Estrutura de dados invalida para a tabela students. Verifique as migrations.",
      );
      schemaError.status = 400;
      throw schemaError;
    }

    throw error;
  }
};

export const userRepository = {
  findByEmail,
  create,
};
