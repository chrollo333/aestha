from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import secrets
from datetime import datetime,timezone,timedelta
from models import User, db
from config import Config


auth_bp = Blueprint('auth', __name__)
SECRET_KEY = Config.SECRET_KEY  



@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        
       
        if not data.get("username") or not data.get("email") or not data.get("password"):
            return jsonify({"error": "Missing required fields"}), 400
        
        #Checking if user exists
        existing_user = User.query.filter((User.email == data ["email"]) | (User.username == data["username"])).first()
        if existing_user:
            return jsonify({"error": "A user with this username or email already exists"}), 400
        
        #Hash password
        hashed_password = generate_password_hash(data["password"])
        
        #giving the user default profile pic 
        default_profile_pic = "../static/default.jpg"
        
        #Creating a new user
        new_user = User(
            username = data["username"],
            email = data["email"],
            password_hash = hashed_password,
            profile_picture = default_profile_pic,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
            
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        current_app.logger.error(f"Error occurred during login: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data.get("email")).first()

        if user and check_password_hash(user.password_hash, data.get("password")):
            token = jwt.encode(
                {"user_id": user.id, "exp": datetime.now(timezone.utc) + timedelta(hours=2)},
                SECRET_KEY,
                algorithm="HS256",
            )
            return jsonify({"token": token})
        
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        current_app.logger.error(f"Error occurred during login: {e}")
        return jsonify({"error": "Internal Server Error"}), 500