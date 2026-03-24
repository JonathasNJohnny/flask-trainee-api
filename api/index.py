from flask import Flask, jsonify
from flasgger import Swagger, swag_from
from DefaultPackage.default_functions import mongo_ping
from UserPackage.user_routes import user_bp

app = Flask(__name__)
swagger = Swagger(app)

app.register_blueprint(user_bp)

@app.route('/api/ping', methods=['GET'])
@swag_from('../docs/mongo_ping.yaml')
def mongo_ping_test():
    result = mongo_ping()
    return result

if __name__ == "__main__":
    app.run(debug=True)