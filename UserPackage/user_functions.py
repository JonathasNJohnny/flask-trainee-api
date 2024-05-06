from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt, re

uri = "mongodb+srv://Johnny:sNfnsk5gMPjAOzwV@trainee.005wfc6.mongodb.net/?retryWrites=true&w=majority&appName=Trainee"

def login_student(email, senha):
    client = MongoClient(uri, server_api=ServerApi('1'))

    mydb = client["projectTrainee"]
    mycollection = mydb["aluno"]

    aluno = mycollection.find_one({"email": email})
    if aluno:
        if bcrypt.checkpw(senha.encode('utf-8'), aluno["senha"].encode('utf-8')):
            return "Login bem-sucedido!"
        else:
            return "Senha incorreta."
    else:
        return "Usuário não encontrado."


def register_student(matricula, nome, email, senha):
    client = MongoClient(uri, server_api=ServerApi('1'))

    mydb = client["projectTrainee"]
    mycollection = mydb["aluno"]

    if not re.match(r'^[\w\.-]+@aluno\.uepb\.edu\.br$', email):
        return "O email deve ser do domínio aluno.uepb.edu.br"

    if mycollection.find_one({"email": email}):
        return "Email já cadastrado, por favor, utilize outro email."
    
    user_senha = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())

    aluno = {
        "matricula": matricula,
        "nome": nome,
        "email": email,
        "senha": user_senha.decode('utf-8')
    }

    mycollection.insert_one(aluno)

    return "Usuário registrado com sucesso!"

def list_users_students():
    client = MongoClient(uri, server_api=ServerApi('1'))

    mydb = client["projectTrainee"]
    mycollection = mydb["aluno"]

    alunos = mycollection.find()
    students = ""
    for aluno in alunos:
        students = students + str(aluno)
    return students

#print(register_student(11111111, "Joãozinho", "joaozinho@aluno.uepb.edu.br", "12345678"))
#print(login_student("joaozinho@aluno.uepb.edu.br", "12345678"))