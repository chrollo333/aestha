#this route handles fetching outfits from the unsplash API and storing them into the database 
#plus it also handles the functionality for the outfits (users liking them)

from flask import Blueprint, jsonify, current_app, request
from models import db, Outfit, User, UserLikes
from dotenv import load_dotenv
from config import Config
import jwt
import requests
import os


# Load environment variables from .env file
load_dotenv()

fashion_bp = Blueprint('fashion', __name__)

#UNSPLASH API CONFIG
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY",)
print("Unsplash Access Key:", UNSPLASH_ACCESS_KEY) #debugging line

SECRET_KEY = Config.SECRET_KEY

@fashion_bp.route('/fetch_outfits', methods=['GET'])
def fetch_outfits():

    try:
        if Outfit.query.count() > 0:
            current_app.logger.info("Outfits already exist in the database. Skipping fetch.")
            return jsonify({"message": "Outfits already exist in the database."})

        query = "fashion+outfit+streetwear+formalwear+casualwear+runway+designer+clothing+style" #Using this to only generate fashion related images
        response = requests.get(f"https://api.unsplash.com/photos/random?query={query}&count=8&client_id={UNSPLASH_ACCESS_KEY}")
        data = response.json()
        
        if not isinstance(data, list):  # Using this to see if the API returned an error
            return jsonify({"error": "Unsplash API error", "details": data}), 500
        
        outfits = []
        for item in data:
            outfit = Outfit(
                image_url=item['urls']['small'],
                source=item['user']['name']
            )
            outfits.append(outfit.to_dict())
            
        db.session.add_all([Outfit(**outfit) for outfit in outfits])  # Bulk insert of outfits
        db.session.commit()
        
        #DEBUG, PRINTING FETCHED DATA HERE
        print("Fetched outfits:", outfits)
        return jsonify(outfits)
    except Exception as e:
        current_app.logger.error(f"Error fetching outfits: {e}")
        return jsonify({"error": "Error fetching outfits"}), 500
    
@fashion_bp.route('/outfits', methods=['GET'])
def get_outfits():
    outfits = Outfit.query.all()
    return jsonify([outfit.to_dict() for outfit in outfits])

@fashion_bp.route('/outfits/<int:outfit_id>/like', methods=['POST'])
def like_outfit(outfit_id):
    token = request.headers.get("Authorization")  # Extract token from request
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_token["user_id"]  # Extract user ID from token
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    outfit = Outfit.query.get(outfit_id)
    if not outfit:
        return jsonify({"error": "Outfit not found"}), 404

    # Check if user already liked the outfit
    user_like = UserLikes.query.filter_by(user_id=user_id, outfit_id=outfit_id).first()
    if user_like:
        return jsonify({"message": "You already liked this outfit"}), 400

    # Add like
    new_like = UserLikes(user_id=user_id, outfit_id=outfit_id)
    db.session.add(new_like)
    outfit.likes += 1
    db.session.commit()

    return jsonify({"message": "Outfit liked", "likes": outfit.likes})
    
@fashion_bp.route('/outfits/<int:outfit_id>/unlike', methods=['DELETE'])
def unlike_outfit(outfit_id):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_token["user_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    outfit = Outfit.query.get(outfit_id)
    if not outfit:
        return jsonify({"error": "Outfit not found"}), 404

    # Check if user has liked the outfit
    user_like = UserLikes.query.filter_by(user_id=user_id, outfit_id=outfit_id).first()
    if not user_like:
        return jsonify({"message": "You haven't liked this outfit"}), 400

    # Remove like
    db.session.delete(user_like)
    outfit.likes -= 1
    db.session.commit()

    return jsonify({"message": "Outfit unliked", "likes": outfit.likes})