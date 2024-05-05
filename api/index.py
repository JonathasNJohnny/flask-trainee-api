from flask import Flask, jsonify
from flasgger import Swagger
from UserPackage.user_routes import user_bp

app = Flask(__name__)
swagger = Swagger(app)

app.register_blueprint(user_bp)

@app.route('/helloworld')
def home():
    return 'Hello, World!'

if __name__ == "__main__":
    app.run(debug=True)