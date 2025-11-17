from flask import request, jsonify, Blueprint
import secrets
from datetime import datetime, timedelta, timezone
import jwt
from werkzeug.security import check_password_hash
from api.models import db, Perfil, Grupo, User, Clan
from werkzeug.security import generate_password_hash
from flask_cors import CORS

api_user = Blueprint('apiUser', __name__)

# Allow CORS requests to this API
CORS(api_user)

@api_user.route('/<int:user_id>/perfil', methods=['POST'])
def crear_perfil(user_id):
    varUser = User.query.get(user_id)
    if varUser is None:
        return jsonify({"msg": f"Usuario con ID {user_id} no existe"}), 404
    perfil_existente = Perfil.query.filter_by(user_id=user_id).first()
    if perfil_existente is not None:
        return jsonify({"msg": "Este usuario ya tiene un perfil creado"}), 400
    body = request.get_json()
    if body is None:
        return jsonify({"msg": "No enviaste un body"}), 400
    if "nombre" not in body or not body["nombre"].strip():
        return jsonify({"msg": "El campo 'nombre' es obligatorio"}), 400
    
    nuevo_perfil = Perfil(
        nombre = body.get("nombre"),
        foto = body.get("foto"),
        presentacion = body.get("presentacion"),
        telefono = body.get("telefono"),
        edad = body.get("edad"),
        ciudad = body.get("ciudad"),
        genero = body.get("genero"),
        twitter = body.get("twitter"),
        facebook = body.get("facebook"),
        instagram = body.get("instagram"),
        user_id = user_id
    )

    db.session.add(nuevo_perfil)
    db.session.commit()

    return jsonify({
        "msg": "Perfil creado correctamente", "perfil": nuevo_perfil.serialize()
    }), 201

@api_user.route('/<int:user_id>/perfil', methods=['GET'])
def get_perfil(user_id):
    varPerfil = Perfil.query.filter_by(user_id=user_id).first()
    if varPerfil is None:
        return jsonify({"msg": f"El usuario con el ID {user_id} no existe"}), 404
    
    response_body = {
        "Perfil": varPerfil.serialize()
    }
    return jsonify(response_body), 200

@api_user.route('/<int:user_id>/perfil', methods=['PUT'])
def editar_perfil(user_id):
    varUser = User.query.get(user_id)
    if varUser is None:
        return jsonify({'msg': f'El usuario con ID {user_id} no existe'}), 404
    varPerfil = Perfil.query.filter_by(user_id=user_id).first()
    if varPerfil is None:
        return jsonify({'msg': f'El usuario con ID {user_id} no tiene perfil creado'}), 404
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'No se encuentra body, no hay datos que actualizar'}), 400

    if "nombre" in body:
        if body["nombre"].strip() == "":
            return jsonify({'msg': 'El nombre no puede estar vacío'}), 400
        varPerfil.nombre = body["nombre"]
    if "foto" in body:
        varPerfil.foto = body["foto"]
    if "presentacion" in body:
        varPerfil.presentacion = body["presentacion"]
    if "telefono" in body:
        varPerfil.telefono = body["telefono"]
    if "edad" in body:
        varPerfil.edad = body["edad"]
    if "ciudad" in body:
        varPerfil.ciudad = body["ciudad"]
    if "genero" in body:
        varPerfil.genero = body["genero"]
    if "twitter" in body:
        varPerfil.twitter = body["twitter"]
    if "facebook" in body:
        varPerfil.facebook = body["facebook"]
    if "instagram" in body:
        varPerfil.instagram = body["instagram"]

    db.session.commit()

    return jsonify({
        'msg': 'Perfil actualizado correctamente', 'perfil': varPerfil.serialize()
    }), 200

@api_user.route('/Saluda', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Este ya es el endpoint de Los usuarios Osea de cada user de la tabla"
    }

    return jsonify(response_body), 200
