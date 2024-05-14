from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"

client = MongoClient(uri, server_api=ServerApi('1'))

mydb = client["projectTrainee"]

# Criando índices para a coleção Aluno
aluno_collection = mydb["aluno"]

aluno_schema = {
    "matricula": "int",
    "nome": "str",
    "email": "str",
    "senha": "str"
}

aluno_collection.create_index("matricula", unique=True)
aluno_collection.create_index("email", unique=True)

# Criando índices para a coleção Empresa
empresa_collection = mydb["empresa"]

empresa_schema = {
    "cnpj": "str",
    "nomeEmpresa": "str",
    "email": "str",
    "senha": "str"
}

empresa_collection.create_index("cnpj", unique=True)
empresa_collection.create_index("email", unique=True)

# Criando índices para a coleção Vaga
vaga_collection = mydb["vaga"]

vaga_schema = {
    "titulo": "str",
    "descricao": "str",
    "dataPub": "date",
    "dataLimite": "date",
    "skills": "str",
    "cnpj_Empresa": "str"
}

# Create the collection with the specified schema
#aluno_collection.insert_one(aluno_schema)
#empresa_collection.insert_one(empresa_schema)
#vaga_collection.insert_one(vaga_schema)
print(mydb.list_collection_names())