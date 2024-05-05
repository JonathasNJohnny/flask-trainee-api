from flask import Flask, Blueprint

user_routes = Blueprint('user_bp', __name__)

@user_routes.route('/user', methods=['POST'])
def register_user():
    return 'Hello World User'