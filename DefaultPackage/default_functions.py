import jwt
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

secret = "@@@12345678@@@"
def generate_token(username, email):
  try:
    payload_data ={
        'username': username,
        'email': email,
        #'exp': int(time.time()) + expiration_time
    }
    token = jwt.encode(
        payload=payload_data,
        key=secret,
        algorithm='HS256',
    )
    return token
  except:
    return "unknow error"
  

def validate_token(token):
  try:
    decoded_payload = jwt.decode(token, secret, algorithms=["HS256"])
    print(f"decoded_payload: ${decoded_payload}")
    return f"decoded_payload: ${decoded_payload}"
  except jwt.InvalidTokenError:
     print("Invalid Token!!!")
     return "invalid_token"
  except:
    print("unknow error")