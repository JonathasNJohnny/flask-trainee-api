from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"
client = MongoClient(uri, server_api=ServerApi('1'))

def mongo_ping():
    client = MongoClient(uri)
    try:
      client.admin.command('ping')
      return {
         "message": "Pinged your deployment. You successfully connected to MongoDB!", 
         "code": 200
         }
    except Exception as e:
      return e, 404
