import type { MongoServerError } from "mongodb";
import { connect } from "../../connect/index.js";
import type { Student, StudentToCreate } from "../../types/user.js";

type HttpError = Error & {
  status?: number;
};

const getStudentsCollection = async () => {
  return connect.getCollection<Student>("students", { mustExist: true });
};

const findByEmail = async (email: string): Promise<Student | null> => {
  const studentsCollection = await getStudentsCollection();
  return studentsCollection.findOne({ email });
};

const create = async (userData: StudentToCreate): Promise<Student> => {
  const studentsCollection = await getStudentsCollection();

  try {
    const result = await studentsCollection.insertOne(userData);
    return {
      ...userData,
      _id: result.insertedId,
    };
  } catch (error: unknown) {
    const mongoError = error as MongoServerError;

    if (mongoError?.code === 11000) {
      const conflictError: HttpError = new Error("Ja existe usuario com esse email");
      conflictError.status = 409;
      throw conflictError;
    }

    if (mongoError?.code === 121) {
      const schemaError: HttpError = new Error(
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
