"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, CV, Job, Postulations
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
import re
import os
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

api = Blueprint('api', __name__)
CORS(api)

# --- Validaciones ---
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    return len(password) >= 6

# --- AUTENTICACIÓN (Email/Pass + Google) ---

@api.route("/signup", methods=["POST"])
def signup():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    name = request.json.get("name", None)
    profesional_title = request.json.get("profesional_title", "")
    
    if not email or not password or not name:
        return {"message": "Email, password y nombre son requeridos"}, 400
    
    if not validate_email(email):
        return {"message": "Formato de email inválido"}, 400
    
    if not validate_password(password):
        return {"message": "La contraseña debe tener al menos 6 caracteres"}, 400
    
    row = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if row:
        return {"message": "El email ya está registrado"}, 409
    
    hashed_password = generate_password_hash(password)
    new_user = Users(
        email=email.lower().strip(),
        password=hashed_password,
        name=name.strip(),
        profesional_title=profesional_title.strip()
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    user = new_user.serialize()
    access_token = create_access_token(identity=email, additional_claims={'user_id': user['id']})
    
    return {
        "message": "Usuario registrado exitosamente",
        "results": user,
        "access_token": access_token
    }, 201

@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if not email or not password:
        return {"message": "Email y contraseña son requeridos"}, 400
    
    row = db.session.execute(db.select(Users).where(Users.email == email.lower().strip())).scalar()
    if not row or not row.password: # Checkeamos row.password por si es usuario de Google sin pass
        return {"message": "Credenciales inválidas"}, 401
    
    if not check_password_hash(row.password, password):
        return {"message": "Credenciales inválidas"}, 401
    
    user = row.serialize()
    access_token = create_access_token(identity=email, additional_claims={'user_id': user['id']})
    
    return {
        "message": "Login exitoso",
        "results": user,
        "access_token": access_token
    }, 200

@api.route("/google_auth", methods=["POST"])
def google_auth():
    """
    Maneja el Login Y el Registro con Google en un solo paso.
    """
    data = request.json
    token = data.get("token")
    
    if not token:
        return {"message": "Token de Google es requerido"}, 400

    try:
        # Verificar token con Google
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        id_info = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)

        email = id_info['email']
        google_id = id_info['sub']
        name = id_info.get('name', 'Usuario Google')

        # Buscar usuario
        user = db.session.execute(db.select(Users).where(Users.email == email)).scalar()

        if user:
            # Login: Actualizar google_id si falta
            if not user.google_id:
                user.google_id = google_id
                db.session.commit()
        else:
            # Registro: Crear usuario nuevo
            user = Users(
                email=email,
                name=name,
                google_id=google_id,
                password=None, 
                profesional_title="Nuevo Usuario"
            )
            db.session.add(user)
            db.session.commit()

        # Generar Token JWT propio
        access_token = create_access_token(identity=email, additional_claims={'user_id': user.id})
        
        return {
            "message": "Autenticación con Google exitosa",
            "access_token": access_token,
            "results": user.serialize()
        }, 200

    except ValueError:
        return {"message": "Token de Google inválido"}, 401
    except Exception as e:
        print(f"Error Google Auth: {e}")
        return {"message": "Error procesando autenticación"}, 500

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    claims = get_jwt()
    return {
        "message": "Autorizado",
        "results": current_user,
        "user_id": claims['user_id']
    }, 200

# --- USUARIOS (CRUD Básico) ---

@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt()['user_id']
    if current_user_id != user_id:
        return {'message': 'No autorizado'}, 403
    
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        return {'message': 'Usuario no encontrado'}, 404
    return {'results': row.serialize()}, 200

@api.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt()['user_id']
    if current_user_id != user_id:
        return {'message': 'No autorizado'}, 403
    
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        return {'message': 'Usuario no encontrado'}, 404
    
    data = request.json
    if 'name' in data: row.name = data['name'].strip()
    if 'profesional_title' in data: row.profesional_title = data['profesional_title'].strip()
    
    db.session.commit()
    return {'results': row.serialize(), 'message': 'Actualizado exitosamente'}, 200

# --- BUSCADOR DE EMPLEOS (Público - API Externa) ---

@api.route('/search_jobs', methods=['GET'])
def search_jobs_external():
    """
    Busca empleos en RapidAPI (JSearch) sin guardarlos en DB.
    """
    search_term = request.args.get('query', '')
    location = request.args.get('location', '')
    
    if not search_term:
        return jsonify({"message": "Ingresa un término de búsqueda"}), 400

    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {"query": f"{search_term} in {location}", "num_pages": "1"}
    
    api_key = os.getenv("RAPIDAPI_KEY")
    if not api_key:
        return jsonify({"message": "Falta configuración del servidor (API Key)"}), 500

    headers = {
        "X-RapidAPI-Key": api_key, 
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        data = response.json()
        return jsonify(data.get('data', [])), 200    
    except Exception as e:
        print(f"Error API Externa: {e}")
        return jsonify({"message": "Error buscando empleos externos"}), 500

# --- KANBAN / TRABAJOS GUARDADOS (Privado - DB Local) ---

@api.route('/jobs', methods=['GET'])
@jwt_required()
def get_user_jobs():
    """
    Obtiene SOLO los trabajos guardados por el usuario actual.
    """
    current_user_id = get_jwt_identity() # Email (identity)
    claims = get_jwt()
    user_id_db = claims['user_id'] # ID numérico
    
    query = db.select(Job).where(Job.user_id == user_id_db)
    
    # Filtros opcionales dentro de mis guardados
    location = request.args.get('location')
    company = request.args.get('company')
    if location: query = query.where(Job.location.ilike(f'%{location}%'))
    if company: query = query.where(Job.company.ilike(f'%{company}%'))
    
    rows = db.session.execute(query).scalars()
    results = [row.serialize() for row in rows]
    
    return {'results': results, 'message': 'Mis trabajos guardados'}, 200

@api.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    """
    Guarda un trabajo en el tablero del usuario.
    """
    claims = get_jwt()
    current_user_id = claims['user_id']
    data = request.json
    
    if not data.get('title') or not data.get('company'):
        return {'message': 'Título y compañía son requeridos'}, 400
    
    new_job = Job(
        user_id=current_user_id, # Asignamos el dueño
        title=data.get('title').strip(),
        company=data.get('company').strip(),
        link=data.get('link', '').strip(),
        description=data.get('description', '').strip(),
        location=data.get('location', '').strip(),
        salary=data.get('salary', '').strip(),
        notes=data.get('notes', '').strip(),
        about_job=data.get('about_job', '').strip(),
        accountabilities=data.get('accountabilities', '').strip(),
        requirements=data.get('requirements', '').strip(),
        benefits=data.get('benefits', '').strip()
    )
    
    db.session.add(new_job)
    db.session.commit()
    
    return {'results': new_job.serialize(), 'message': 'Trabajo guardado exitosamente'}, 201