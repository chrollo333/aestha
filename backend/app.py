#Main application
#It initializes Flask, sets up database connections, registers API routes, and starts the server.

from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from models import db,User,Outfit,UserLikes
from routes.fashion_routes import fashion_bp, fetch_outfits
from routes.auth_routes import auth_bp


app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
app.config.from_object("config.Config")

# Print the database URI to verify
print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI'])
# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)  # Allow frontend requests


# This is used to register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(fashion_bp, url_prefix="/api/fashion")

# Fetch outfits on startup
with app.app_context():
    fetch_outfits()

#Routing starts here
@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')


@app.route("/success/<name>")
def success(name):
    return f"Hello {name}"

@app.route("/api/login", methods=["POST"])
def login():
    try:    #Catching exceptions
            data = request.get_json() #Used to get JSON data from react
            user = data.get("nm")
            if user:
                return jsonify({"message": "Success!", "name": user})
            else:
                return jsonify({"error": "No name provided"}), 400
    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    
@app.route('/<path:path>')
def serve_static_files(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')    
    
if __name__ == "__main__":
    app.run(debug=True)