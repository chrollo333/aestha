#Defines database models using SQLAlchemy (tables like users, outfits, etc.)


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
db = SQLAlchemy()

class User(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    profile_picture = db.Column(db.String(255), default="default.jpg")
    login_attempts = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
class Outfit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(500), nullable=False) #This is used for the API produced image url
    source = db.Column(db.String(255), nullable=False) #Used for the source of the API
    likes = db.Column(db.Integer, default=0) #Used for likes on outfit posts
    date_added = db.Column(db.DateTime, default=datetime.now(timezone.utc)) #Datetime based on the UTC timezone
    
    def to_dict(self): #this is later used to send to an API endpoint, to display the outfit data with React (JSON data required)
        return {
            "id": self.id,
            "image_url": self.image_url,
            "source": self.source,
            "likes": self.likes,
            "date_added": self.date_added.strftime('%Y-%m-%d %H:%M:%S') if self.date_added else None
        }
        
class UserLikes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    outfit_id = db.Column(db.Integer, db.ForeignKey("outfit.id"), nullable=False)
    user = db.relationship("User", backref=db.backref("liked_outfits", lazy=True))
    outfit = db.relationship("Outfit", backref=db.backref("user_likes", lazy=True))