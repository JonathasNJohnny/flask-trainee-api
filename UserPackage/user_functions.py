from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt, re, uuid
from flask import jsonify

uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"
client = MongoClient(uri, server_api=ServerApi('1'))
mydb = client["projectTrainee"]
mycollection = mydb["aluno"]

def login_student(email, senha):
    aluno = mycollection.find_one({"email": email})
    if aluno:
        if bcrypt.checkpw(senha.encode('utf-8'), aluno["senha"].encode('utf-8')):
            return {
                "message": "Login bem-sucedido!", 
                "code": 200,
                "data": {
                    "matricula": aluno["matricula"],
                    "nome": aluno["nome"],
                    "email": aluno["email"]
                    }
                }
        else:
            return {
                "message": "Senha incorreta!", 
                "code": 406
                }
    else:
        return {
            "message": "Usuário não encontrado!", 
            "code": 405
            }


def register_student(matricula, nome, email, senha):
    if not re.match(r'^[\w\.-]+@aluno\.uepb\.edu\.br$', email):
        return {
            "message": "O email deve ser do domínio aluno.uepb.edu.br!", 
            "code": 405
            }

    if mycollection.find_one({"Email": email}):
        return {
            "message": "Email já cadastrado, por favor, utilize outro email!", 
            "code": 406
            }
    
    user_senha = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())

    aluno = {
        "matricula": matricula,
        "nome": nome,
        "email": email,
        "senha": user_senha.decode('utf-8')
    }

    mycollection.insert_one(aluno)

    return {
        "message": "Usuário registrado com sucesso!",
        "code": 200
        }

def list_users_students():
    alunos = mycollection.find()

    for aluno in alunos:
        print("ID:", aluno["id"])
        print("Matrícula:", aluno["Matricula"])
        print("Nome:", aluno["Nome"])
        print("Email:", aluno["Email"])
        print("Senha:", aluno["Senha"])
        print("---------------------------------")

def mongo_db_ping():
    client = MongoClient(uri)
    try:
      client.admin.command('ping')
      return {
          "message": "Pinged your deployment. You successfully connected to MongoDB!",
          "code": 200
          }
    except Exception as e:
      return {
          "message": e,
          "code": 404
          }

#print(mongo_db_ping())
#print(list_users_students())
#print(register_student(11111111, "Joãozinho", "joaozinho@aluno.uepb.edu.br", "12345678"))
#print(register_student(22222222, "Mariana", "mariana@aluno.uepb.edu.br", "12345678"))
#print(login_student("joaozinho@aluno.uepb.edu.br", "12345678"))
