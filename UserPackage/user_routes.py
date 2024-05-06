from flask import Blueprint, jsonify, request
from UserPackage.user_functions import login_student

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
    result = email+senha
    return result