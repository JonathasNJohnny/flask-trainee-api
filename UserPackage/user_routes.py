from flask import Blueprint, jsonify, request
from UserPackage.user_functions import login_student

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/',methods=['GET'])
def teste():
    print("Hello world")
    return "hello"

@user_bp.route('/api/user/login', methods=['POST'])
def user_login():
    """
    Login
    ---
    tags:
      - Rotas de usuário
    parameters:
      - in: body
        name: login_info
        description: Informações de login (email e senha)
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
            senha:
              type: string
    responses:
      200:
        description: Logado
    """
    login_info = request.get_json()
    email = login_info.get("email")
    senha = login_info.get("senha")
    response = login_student(email, senha)
    return jsonify({"message": response})

@user_bp.route('/testes',methods=['GET'])
def teste():
    print("Hello world")
    return "Testante"