from flask import Blueprint, jsonify, request
from flasgger import swag_from
from UserPackage.user_functions import login_student

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/user/login', methods=['POST'])
@swag_from('api_documentation.yaml', endpoint='user_login')
def user_login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")
    result = login_student(email, senha)
    return jsonify({"message": result})