"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, redirect
import jwt
import os
from api.models import db, User
from api.utils import generate_sitemap, APIException
from api.auth import jwt_required
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/users', methods=['GET'])
@jwt_required
def list_users(auth_user_id):
    users = User.query.all()
    data = [
        {
            'id': u.id,
            'email': u.email,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'is_active': bool(u.is_active)
        }
        for u in users
    ]
    return jsonify(data), 200


@api.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required
def update_user(auth_user_id, user_id):
    data = request.get_json() or {}
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    user.email = data.get('email', user.email)
    if 'first_name' in data:
        user.first_name = data.get('first_name')
    if 'last_name' in data:
        user.last_name = data.get('last_name')
    db.session.commit()
    return jsonify({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_active': bool(user.is_active)
    }), 200


@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required
def delete_user(auth_user_id, user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado"}), 200


@api.route('/dev-tools', methods=['GET'])
def dev_tools():
    return redirect(url_for('static', filename='dev-tools.html'))


@api.route('/private', methods=['GET'])
def private_route():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"msg": "Token requerido"}), 401

    try:
        token = auth_header.split(' ')[1]
        payload = jwt.decode(
            token,
            os.getenv('JWT_SECRET_KEY'),
            algorithms=['HS256']
        )

        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        return jsonify({
            "msg": "Acceso permitido",
            "email": user.email
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"msg": "Token expirado"}), 401
    except Exception:
        return jsonify({"msg": "Token inválido"}), 401
