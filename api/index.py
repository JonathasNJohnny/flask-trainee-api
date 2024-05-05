from flask import Flask, jsonify
from flasgger import Swagger
from user_routes.user import login_student

app = Flask(__name__)
swagger = Swagger(app)

@app.route('/helloworld')
def home():
    """
    Hello World Endpoint
    ---
    tags:
      - Rotas de testes
    responses:
      200:
        description: Hello World
    """
    return 'Hello, World!'

@app.route('/api/user/login', methods=['GET'])
def user_login():
    """
    Login
    ---
    tags:
      - Rotas de usuário
    responses:
      200:
        description: Logado
    """
    response = login_student()
    return jsonify({"message": response})

if __name__ == "__main__":
    app.run(debug=True)