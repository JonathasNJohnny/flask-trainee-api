from flask import Blueprint

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/user', methods=['GET'])
def register_user():
    return 'Hello World User'