#Stores configuration settings (e.g., database URI, secret keys).
#Uses environment variables to avoid hardcoding sensitive info.

import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://aestha_user:Dogemon123@localhost:5432/aestha_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False