from flask import Blueprint, jsonify, request
from UserPackage.user_functions import login_student
from UserPackage.user_functions import list_users_students
from pymongo import MongoClient

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/',methods=['GET'])
def teste():
    print("Hello world")
    return "hello"

@user_bp.route('/api/user/login', methods=['POST'])
def user_login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")
    result = list_users_students()
    return result

@user_bp.route('/api/ping', methods=['GET'])
def ping():
  # URI de conexão com o cluster MongoDB Atlas
  uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"

  # Criar um cliente MongoDB
  client = MongoClient(uri)

  # Tentar enviar um ping para o cluster
  try:
      client.admin.command('ping')
      print("Pinged your deployment. You successfully connected to MongoDB!")
      return "Pinged your deployment. You successfully connected to MongoDB!"
  except Exception as e:
      print(e)
      return e
