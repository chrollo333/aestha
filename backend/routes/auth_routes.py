from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
import jwt
import datetime
from models import db, User
from config import SECRET_KEY  # Store a secret key for JWT

auth_bp = Blueprint('auth', __name__)

#@auth_bp.route('')