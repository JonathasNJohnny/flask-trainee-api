from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt, re

uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"

def login_student(email, senha):
    client = MongoClient(uri, server_api=ServerApi('1'))

    mydb = client["projectTrainee"]
    mycollection = mydb["aluno"]

    aluno = mycollection.find_one({"Email": email})
    if aluno:
        if bcrypt.checkpw(senha.encode('utf-8'), aluno["Senha"].encode('utf-8')):
            return "Login bem-sucedido!", 200
        else:
            return "Senha incorreta.", 404
    else:
        return "Usuário não encontrado.", 405


def register_student(matricula, nome, email, senha):
    client = MongoClient(uri, server_api=ServerApi('1'))

    mydb = client["projectTrainee"]
    mycollection = mydb["aluno"]

    if not re.match(r'^[\w\.-]+@aluno\.uepb\.edu\.br$', email):
        return "O email deve ser do domínio aluno.uepb.edu.br"

    if mycollection.find_one({"Email": email}):
        return "Email já cadastrado, por favor, utilize outro email."
    
    user_senha = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())

    aluno = {
        "Matricula": matricula,
        "Nome": nome,
        "Email": email,
        "Senha": user_senha.decode('utf-8')
    }

    mycollection.insert_one(aluno)

    return "Usuário registrado com sucesso!"

def list_users_students():
    client = MongoClient(uri, server_api=ServerApi('1'))

    mydb = client["projectTrainee"]
    mycollection = mydb["aluno"]

    alunos = mycollection.find()

    for aluno in alunos:
        print("Matrícula:", aluno["Matricula"])
        print("Nome:", aluno["Nome"])
        print("Email:", aluno["Email"])
        print("Senha:", aluno["Senha"])
        print("---------------------------------")

#print(list_users_students())
#print(register_student(1, "Joãozinho", "joaozinho@aluno.uepb.edu.br", "12345678"))
#print(login_student("joaozinho@aluno.uepb.edu.br", "12345678"))