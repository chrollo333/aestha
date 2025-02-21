from models import db, Outfit

def check_outfits():
    outfits = Outfit.query.all()
    for outfit in outfits:
        print(outfit.to_dict())

if __name__ == "__main__":
    from app import app
    with app.app_context():
        check_outfits()