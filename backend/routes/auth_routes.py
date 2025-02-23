from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import secrets
from datetime import datetime
from models import User, db
from config import SECRET_KEY  # Store a secret key for JWT

auth_bp = Blueprint('auth', __name__)

#@auth_bp.route('')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    #Getting data from request, if a field is missing, throw an error
    if not data("username") or not data("email") or not data("password"):
        return jsonify({"error": "Missing required fields"}), 400
    
    #Checking if user exists
    existing_user = User.query.filter((User.email == data ["email"]) | (User.username == data["username"])).first()
    if existing_user:
        return jsonify({"error": "A user with this username or email already exists"}), 400
    
    #Hash password
    hashed_password = generate_password_hash(data["password"])
    
    #giving the user default profile pic 
    default_profile_pic = "default.jpg"
    
    #Creating a new user
    new_user = User(
        username = data["username"],
        email = data["email"],
        password_hash = hashed_password,
        profile_picture = default_profile_pic,
        
        
        
        
        
    )

        