from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt, re

uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"
client = MongoClient(uri, server_api=ServerApi('1'))
mydb = client["projectTrainee"]

def login_student(email, senha):
    mycollection = mydb["aluno"]
    aluno = mycollection.find_one({"email": email})
    if aluno:
        if bcrypt.checkpw(senha.encode('utf-8'), aluno["senha"].encode('utf-8')):
            return {
                "message": "Login bem-sucedido!", 
                "data": {
                    "matricula": aluno["matricula"],
                    "nome": aluno["nome"],
                    "email": aluno["email"]
                    }
                }, 200
        else:
            return {
                "message": "Senha incorreta!", 
                }, 406
    else:
        return {
            "message": "Usuário não encontrado!", 
            }, 405


def register_student(matricula, nome, email, senha):
    mycollection = mydb["aluno"]
    if not re.match(r'^[\w\.-]+@aluno\.uepb\.edu\.br$', email):
        return {
            "message": "O email deve ser do domínio aluno.uepb.edu.br!", 
            }, 405
    
    if mycollection.find_one({"email": email}):
        return {
            "message": "Email já cadastrado, por favor, utilize outro email!", 
            }, 406
    
    if mycollection.find_one({"matricula": matricula}):
        return {
            "message": "Matricula já cadastrada, por favor, utilize a sua matrícula!", 
            }, 407
    
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
        }, 200

def login_company(email, senha):
    mycollection = mydb["empresa"]
    empresa = mycollection.find_one({"email": email})
    if empresa:
        if bcrypt.checkpw(senha.encode('utf-8'), empresa["senha"].encode('utf-8')):
            return {
                "message": "Login bem-sucedido!", 
                "data": {
                    "cnpj": empresa['cnpj'],
                    "nomeEmpresa": empresa['nomeEmpresa'],
                    "email": empresa['email']
                    }
                }, 200
        else:
            return {
                "message": "Senha incorreta!",
            }, 406
    else:
        return {
            "message": "Empresa não encontrada!",
        }, 405


def register_company(cnpj, nomeEmpresa, email, senha):
    mycollection = mydb["empresa"]
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return {
            "message":"Insira um email válido!"
            }, 405
    if mycollection.find_one({"email": email}):
        return {
            "message":"Email já cadastrado, por favor, utilize outro email!"
            }, 406
    if mycollection.find_one({"cnpj": cnpj}):
        return {
            "message":"CNPJ já cadastrado, por favor, utilize outro CNPJ!"
            }, 407
    user_senha = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())

    empresa = {
        "cnpj": cnpj,
        "nomeEmpresa": nomeEmpresa,
        "email": email,
        "senha": user_senha.decode('utf-8')
    }

    mycollection.insert_one(empresa)
    
    return {
        "message": "Empresa resgistrada com sucesso!"
    }, 200

def mongo_db_ping():
    client = MongoClient(uri)
    try:
      client.admin.command('ping')
      return {
          "message": "Pinged your deployment. You successfully connected to MongoDB!",
          }, 200
    except Exception as e:
      return {
          "message": e,
          }, 400

#print(mongo_db_ping())
#print(list_users_students())
#print(register_student(11111111, "Joãozinho", "joaozinho@aluno.uepb.edu.br", "12345678"))
#print(register_student(22222222, "Mariana", "mariana@aluno.uepb.edu.br", "12345678"))
#print(login_student("joaozinho@aluno.uepb.edu.br", "12345678"))