import type { MongoServerError } from "mongodb";
import { connect } from "../../connect/index.js";
import type {
  Enterprise,
  EnterpriseToCreate,
} from "../../types/enterprise.js";

type HttpError = Error & {
  status?: number;
};

const getEnterprisesCollection = async () => {
  return connect.getCollection<Enterprise>("enterprises", { mustExist: true });
};

const findByEmail = async (email: string): Promise<Enterprise | null> => {
  const enterprisesCollection = await getEnterprisesCollection();
  return enterprisesCollection.findOne({ email });
};

const findByCnpj = async (cnpj: string): Promise<Enterprise | null> => {
  const enterprisesCollection = await getEnterprisesCollection();
  return enterprisesCollection.findOne({ cnpj });
};

const create = async (
  enterpriseData: EnterpriseToCreate,
): Promise<Enterprise> => {
  const enterprisesCollection = await getEnterprisesCollection();

  try {
    const result = await enterprisesCollection.insertOne(enterpriseData);
    return {
      ...enterpriseData,
      _id: result.insertedId,
    };
  } catch (error: unknown) {
    const mongoError = error as MongoServerError;

    if (mongoError?.code === 11000) {
      const conflictError: HttpError = new Error(
        "Ja existe empresa com esse email ou CNPJ",
      );
      conflictError.status = 409;
      throw conflictError;
    }

    if (mongoError?.code === 121) {
      const schemaError: HttpError = new Error(
        "Estrutura de dados invalida para a tabela enterprises. Verifique as migrations.",
      );
      schemaError.status = 400;
      throw schemaError;
    }

    throw error;
  }
};

export const enterpriseRepository = {
  findByEmail,
  findByCnpj,
  create,
};
