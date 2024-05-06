from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"

client = MongoClient(uri, server_api=ServerApi('1'))

mydb = client["projectTrainee"]

mycollection = mydb["aluno"]

schema = {
    "id": "int",
    "matricula": "int",
    "nome": "str",
    "email": "str",
    "senha": "str"
}

mycollection.create_index("id", unique=True)
mycollection.create_index("matricula", unique=True)
mycollection.create_index("email", unique=True)

print(mydb.list_collection_names())
