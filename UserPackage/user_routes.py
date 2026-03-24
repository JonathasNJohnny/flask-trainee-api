from flask import Blueprint, request
from flasgger import swag_from
from UserPackage.user_functions import login_student
from UserPackage.user_functions import register_student
from UserPackage.user_functions import login_company
from UserPackage.user_functions import register_company

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/user/student/login', methods=['POST'])
@swag_from('../docs/user_student_login.yaml')
def user_student_login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")
    result = login_student(email, senha)
    return result

@user_bp.route('/api/user/student/register', methods=['POST'])
@swag_from('../docs/user_student_register.yaml')
def user_student_register():
    data = request.get_json()
    matricula = data.get("matricula")
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")
    result = register_student(matricula, nome, email, senha)
    return result

@user_bp.route('/api/user/company/register', methods=['POST'])
@swag_from('../docs/user_company_register.yaml')
def user_company_register():
    data = request.get_json()
    cnpj = data.get("cnpj")
    nomeEmpresa = data.get("nomeEmpresa")
    email = data.get("email")
    senha = data.get("senha")
    result = register_company(cnpj, nomeEmpresa, email, senha)
    return result

@user_bp.route('/api/user/company/login', methods=['POST'])
@swag_from('../docs/user_company_login.yaml')
def user_company_login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")
    result = login_company(email, senha)
    return result