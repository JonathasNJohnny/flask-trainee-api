from flask import Flask, jsonify
from flasgger import Swagger

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
    response = user_login()
    return jsonify({"message": response})

if __name__ == "__main__":
    app.run(debug=True)


#Functions - Start
def user_login():
    return "Logado"
#Functions - End