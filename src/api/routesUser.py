from flask import request, jsonify, Blueprint
from datetime import datetime, timedelta, timezone
from api.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from flask_cors import CORS

api_user = Blueprint('apiUser', __name__)
SECRET_KEY = "super-secret-key"
CORS (api_user)
def token_requerido(f):
    def wrapper(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        auth = request.headers.get('Authorization')
        if not auth or not auth.startswith('Bearer '):
            return jsonify({"msg": "Token requerido"}), 401
        token = auth.split(' ')[1]
        try:
            jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except Exception:
            return jsonify({"msg": "Token inválido"}), 401
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

@api_user.route('/register', methods=['POST'])
def create_profile():
    print ("hola")
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')
    name = body.get('name')
    if not email or not password or not name:
        return jsonify({"msg": "Falta correo, contraseña o nombre"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario ya existe"}), 400
    hashed_password = generate_password_hash(password)
    nuevo_perfil = User(
        email=email,
        password=hashed_password,
        name=name,
        photo=body.get("photo"),
        bio=body.get("bio"),
        phone=body.get("phone"),
        age=body.get("age"),
        city=body.get("city"),
        gender=body.get("gender"),
        twitter=body.get("twitter"),
        facebook=body.get("facebook"),
        instagram=body.get("instagram"),
    )
    db.session.add(nuevo_perfil)
    db.session.commit()
    return jsonify({"msg": "Perfil creado correctamente", "perfil": nuevo_perfil.serialize()}), 201

@api_user.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"msg": "Falta correo o contraseña"}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(minutes=15)
    }, SECRET_KEY, algorithm="HS256")
    return jsonify({"token": token, "user": user.serialize()}), 200

@api_user.route('/<int:user_id>', methods=['GET'])
@token_requerido
def get_user():
    auth = request.headers.get('Authorization')
    token = auth.split(' ')[1]
    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    user = User.query.get(payload['user_id'])
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200


@api_user.route('/<int:user_id>', methods=['PUT', 'OPTIONS'])
@token_requerido
def update_user(user_id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    data = request.get_json() or {}
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return jsonify({"msg": "Token no proporcionado"}), 401

    token = auth.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return jsonify({"msg": "Token expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"msg": "Token inválido"}), 401

    if payload['user_id'] != user_id:
        return jsonify({"msg": "No autorizado para actualizar este usuario"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    email = data.get('email')
    if email:
        if User.query.filter(User.email == email, User.id != user.id).first():
            return jsonify({"msg": "El email ya está en uso"}), 400
        user.email = email

    password = data.get('password')
    if password:
        user.password = generate_password_hash(password)

    user.name = data.get('name', user.name)
    user.photo = data.get('photo', user.photo)
    user.bio = data.get('bio', user.bio)
    user.phone = data.get('phone', user.phone)
    user.age = data.get('age', user.age)
    user.city = data.get('city', user.city)
    user.gender = data.get('gender', user.gender)
    user.twitter = data.get('twitter', user.twitter)
    user.facebook = data.get('facebook', user.facebook)
    user.instagram = data.get('instagram', user.instagram)

    db.session.commit()

    return jsonify({"msg": "Usuario actualizado correctamente", "perfil": user.serialize()}), 200

@api_user.route('/Saluda', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Este ya es el endpoint de Los usuarios Osea de cada user de la tabla"
    }
    return jsonify(response_body), 200