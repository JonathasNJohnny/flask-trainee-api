from flask import Flask, jsonify
from flasgger import Swagger
from user import user

app = Flask(__name__)
swagger = Swagger(app)

app.register_blueprint(user.user_bp)

@app.route('/helloworld')
def home():
    return 'Hello, World!'

@app.route('/about')
def about():
    return 'About'

@app.route('/api/example', methods=['GET'])
def example_endpoint():
    """
    Exemplo de endpoint
    ---
    responses:
      200:
        description: Este é um exemplo de endpoint
      404:
        description: error
    """
    return jsonify({"message": "Este é um exemplo de endpoint"})

if __name__ == "__main__":
    app.run(debug=True)