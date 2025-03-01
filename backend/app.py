#Main application
#It initializes Flask, sets up database connections, registers API routes, and starts the server.

from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from models import db, User, Outfit, UserLikes
from routes.fashion_routes import fashion_bp, fetch_outfits
from routes.auth_routes import auth_bp
from routes.news_routes import news_bp
from dotenv import load_dotenv


load_dotenv()



app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
app.config.from_object("config.Config")

# Prints the database URI to verify
print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI'])
# Initializes extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)  # Allows frontend requests


# This is used to register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(fashion_bp, url_prefix="/api/fashion")
app.register_blueprint(news_bp, url_prefix="/api")
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

    
@app.route('/<path:path>')
def serve_static_files(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')    
    
if __name__ == "__main__":
    app.run(debug=True)