from models import db, Outfit

def clear_outfits():
    try:
        num_deleted = db.session.query(Outfit).delete()
        db.session.commit()
        print(f"Deleted {num_deleted} outfits from the database.")
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting outfits: {e}")

if __name__ == "__main__":
    from app import app
    with app.app_context():
        clear_outfits()