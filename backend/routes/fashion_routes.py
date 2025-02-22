#this route handles fetching outfits from the unsplash API and storing them into the database 
#plus it also handles the functionality for the outfits (users liking them)

from flask import Blueprint, jsonify, current_app
from models import db, Outfit
from dotenv import load_dotenv
import requests
import os

# Load environment variables from .env file
load_dotenv()

fashion_bp = Blueprint('fashion', __name__)

#UNSPLASH API CONFIG
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY",)
print("Unsplash Access Key:", UNSPLASH_ACCESS_KEY) #debugging line

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
    outfit = Outfit.query.get(outfit_id)
    if outfit:
        outfit.likes += 1
        db.session.commit()
        return jsonify({"message": "Outfit liked", "likes": outfit.likes})
    else:
        return jsonify({"error": "Outfit not found"}), 400