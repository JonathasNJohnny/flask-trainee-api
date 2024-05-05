from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"

client = MongoClient(uri, server_api=ServerApi('1'))

mydb = client["projectTrainee"]

mycollection = mydb["aluno"]

schema = {
    "Id": "int",
    "Matricula": "int",
    "Nome": "str",
    "Email": "str",
    "Senha": "str"
}

mycollection.create_index("Id", unique=True)
mycollection.create_index("Matricula", unique=True)
mycollection.create_index("Email", unique=True)

print(mydb.list_collection_names())
