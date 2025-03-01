import requests 
from flask import jsonify, Blueprint

news_bp = Blueprint("news", __name__)



NEWS_API_KEY = "b095b63f-00b6-4692-8076-c2469fc4d74c"
NEWS_URL = f"https://content.guardianapis.com/search?section=fashion&show-fields=thumbnail,trailText&api-key={NEWS_API_KEY}"


@news_bp.route("/news", methods=["GET"])
def get_news():
    response = requests.get(NEWS_URL)
    data = response.json()
    
    
    #Extracting relevant fields here
    
    articles = [
        {
            "title": article["webTitle"],
            "url": article["webUrl"],
            "image": article["fields"].get("thumbnail", ""),
            "description": article["fields"].get("trailText", "No description available.")
        }
        for article in data["response"]["results"]
    ]
    return jsonify(articles) #used to send this data to frontend

