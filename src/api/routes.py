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
from datetime import datetime

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
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    name = request.json.get("name", "")
    profesional_title = request.json.get("profesional_title", "")
    
    if not email or not password:
        return {"message": "Email y password son requeridos"}, 400
    
    if not validate_email(email):
        return {"message": "Formato de email inválido"}, 400
    
    if not validate_password(password):
        return {"message": "La contraseña debe tener al menos 6 caracteres"}, 400
    
    print(email)
    
    row = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if row:
        return {"message": "El email ya está registrado"}, 409
    print(row)
    hashed_password = generate_password_hash(password)
    new_user = Users(
        email=email.lower().strip(),
        password=hashed_password,
        name=name.strip() if name else "",
        profesional_title=profesional_title.strip() if profesional_title else ""
    )
    
    print(new_user)
    
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
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if not email or not password:
        return {"message": "Email y contraseña son requeridos"}, 400
    
    row = db.session.execute(db.select(Users).where(Users.email == email.lower().strip())).scalar()
    if not row or not row.password:
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
    if 'phone' in data: row.phone = data['phone'].strip() if data['phone'] else None
    if 'linkedin_url' in data: row.linkedin_url = data['linkedin_url'].strip() if data['linkedin_url'] else None
    if 'portfolio_url' in data: row.portfolio_url = data['portfolio_url'].strip() if data['portfolio_url'] else None
    if 'photo_url' in data: row.photo_url = data['photo_url'].strip() if data['photo_url'] else None
    
    db.session.commit()
    return {'results': row.serialize(), 'message': 'Actualizado exitosamente'}, 200

@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt()['user_id']
    if current_user_id != user_id:
        return {'message': 'No autorizado'}, 403
        
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row: return {'message': 'Usuario no encontrado'}, 404
    
    # SQLAlchemy borrará en cascada si está configurado, o borramos manualmente:
    db.session.execute(db.delete(Postulations).where(Postulations.user_id == user_id))
    db.session.execute(db.delete(CV).where(CV.user_id == user_id))
    db.session.delete(row)
    db.session.commit()
    
    return {'message': 'Usuario eliminado'}, 200

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

# --- KANBAN / POSTULACIONES ---

@api.route('/postulations', methods=['GET'])
@jwt_required()
def get_user_postulations():
    """
    Trae todas las tarjetas del Kanban del usuario.
    """
    claims = get_jwt()
    user_id = claims['user_id']
    
    rows = db.session.execute(db.select(Postulations).where(Postulations.user_id == user_id)).scalars()
    results = [row.serialize() for row in rows]
    
    return {'results': results, 'message': 'Mi Kanban'}, 200

@api.route('/postulations', methods=['POST'])
@jwt_required()
def add_to_kanban():
    """
    Recibe un empleo (posiblemente de JSearch), lo guarda en Job y crea la Postulation.
    """
    claims = get_jwt()
    user_id = claims['user_id']
    data = request.json
    
    job_payload = data.get('job', {})
    
    title = job_payload.get('job_title') or job_payload.get('title')
    company = job_payload.get('employer_name') or job_payload.get('company')
    
    if not title or not company:
        return {'message': 'Datos del trabajo incompletos'}, 400

    existing_job = db.session.execute(
        db.select(Job).where(Job.title == title, Job.company == company)
    ).scalar()

    if existing_job:
        job_id = existing_job.id
    else:
        new_job = Job(
            title=title,
            company=company,
            link=job_payload.get('job_apply_link') or job_payload.get('link', ''),
            description=job_payload.get('job_description') or job_payload.get('description', ''),
            location=job_payload.get('job_city') or job_payload.get('location', ''),
            salary=job_payload.get('salary', '')
        )
        db.session.add(new_job)
        db.session.commit()
        job_id = new_job.id

    existing_post = db.session.execute(
        db.select(Postulations).where(Postulations.user_id == user_id, Postulations.job_id == job_id)
    ).scalar()

    if existing_post:
        return {'message': 'Ya tienes este trabajo en tu tablero'}, 409

    new_postulation = Postulations(
        user_id=user_id,
        job_id=job_id,
        status=data.get('status', 'Pendiente'),
        name=f"Candidatura a {company}",
        cv_id=None # Inicialmente sin CV
    )
    
    db.session.add(new_postulation)
    db.session.commit()
    
    return {'results': new_postulation.serialize(), 'message': 'Agregado al Kanban'}, 201

@api.route('/postulations/<int:postulation_id>', methods=['PUT'])
@jwt_required()
def update_postulation(postulation_id):
    """
    Mueve la tarjeta (cambia status) o agrega CV.
    """
    claims = get_jwt()
    user_id = claims['user_id']
    data = request.json
    
    row = db.session.execute(db.select(Postulations).where(Postulations.id == postulation_id)).scalar()
    
    if not row: return {'message': 'No encontrado'}, 404
    if row.user_id != user_id: return {'message': 'No autorizado'}, 403
    
    if 'status' in data: row.status = data['status']
    if 'cv_id' in data: row.cv_id = data['cv_id']
    if 'interview_date' in data and data['interview_date']:
        try:
            row.interview_date = datetime.fromisoformat(data['interview_date'].replace('Z', '+00:00'))
        except ValueError:
            pass 
            
    db.session.commit()
    return {'results': row.serialize(), 'message': 'Actualizado'}, 200

@api.route('/postulations/<int:postulation_id>', methods=['DELETE'])
@jwt_required()
def delete_postulation(postulation_id):
    claims = get_jwt()
    user_id = claims['user_id']
    
    row = db.session.execute(db.select(Postulations).where(Postulations.id == postulation_id)).scalar()
    if not row: return {'message': 'No encontrado'}, 404
    if row.user_id != user_id: return {'message': 'No autorizado'}, 403
    
    db.session.delete(row)
    db.session.commit()
    return {'message': 'Eliminado del tablero'}, 200

# --- CVS (Gestión de Curriculums) ---

@api.route('/cv', methods=['POST'])
@jwt_required()
def create_cv():
    claims = get_jwt()
    current_user_id = claims['user_id']
    data = request.json
    cv_url = data.get('cv_url')
    
    if not cv_url: return {'message': 'URL requerida'}, 400
        
    new_cv = CV(cv_url=cv_url, user_id=current_user_id)
    db.session.add(new_cv)
    db.session.commit()
    return {'results': new_cv.serialize(), 'message': 'CV Agregado'}, 201

@api.route('/users/<int:user_id>/cvs', methods=['GET'])
@jwt_required()
def get_user_cvs(user_id):
    claims = get_jwt()
    if claims['user_id'] != user_id: return {'message': 'No autorizado'}, 403
        
    rows = db.session.execute(db.select(CV).where(CV.user_id == user_id)).scalars()
    return {'results': [row.serialize() for row in rows]}, 200

@api.route('/cv/<int:cv_id>', methods=['DELETE'])
@jwt_required()
def delete_cv(cv_id):
    claims = get_jwt()
    row = db.session.execute(db.select(CV).where(CV.id == cv_id)).scalar()
    
    if not row: return {'message': 'No encontrado'}, 404
    if row.user_id != claims['user_id']: return {'message': 'No autorizado'}, 403
    
    db.session.delete(row)
    db.session.commit()
    return {'message': 'CV eliminado'}, 200

# --- UPLOADS (Foto de Perfil y CV) ---

import base64
import uuid

@api.route('/users/<int:user_id>/upload_photo', methods=['POST'])
@jwt_required()
def upload_user_photo(user_id):
    """
    Sube una foto de perfil en base64 y guarda la URL/data URI.
    """
    current_user_id = get_jwt()['user_id']
    if current_user_id != user_id:
        return {'message': 'No autorizado'}, 403
    
    data = request.json
    photo_base64 = data.get('photo_base64')
    
    if not photo_base64:
        return {'message': 'No se proporcionó imagen'}, 400
    
    try:
        # Verificar que es un base64 válido
        if ',' in photo_base64:
            header, encoded = photo_base64.split(',', 1)
        else:
            encoded = photo_base64
        
        # Validar que es una imagen decodificable
        decoded = base64.b64decode(encoded)
        if len(decoded) > 5 * 1024 * 1024:  # Máximo 5MB
            return {'message': 'La imagen es demasiado grande (máx 5MB)'}, 400
        
        # Guardar la data URI completa
        row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if not row:
            return {'message': 'Usuario no encontrado'}, 404
        
        row.photo_url = photo_base64
        db.session.commit()
        
        return {'results': row.serialize(), 'message': 'Foto actualizada'}, 200
    
    except Exception as e:
        return {'message': f'Error procesando imagen: {str(e)}'}, 400


@api.route('/cv/upload', methods=['POST'])
@jwt_required()
def upload_cv_file():
    """
    Sube un archivo CV (PDF/DOC/DOCX) en base64 y lo guarda.
    """
    claims = get_jwt()
    user_id = claims['user_id']
    
    data = request.json
    file_base64 = data.get('file_base64')
    filename = data.get('filename', 'cv.pdf')
    
    if not file_base64:
        return {'message': 'No se proporcionó archivo'}, 400
    
    # Validar extensión
    allowed_extensions = ['.pdf', '.doc', '.docx']
    file_ext = filename.lower()[filename.rfind('.'):] if '.' in filename else ''
    if file_ext not in allowed_extensions:
        return {'message': 'Formato no permitido. Use PDF, DOC o DOCX'}, 400
    
    try:
        # Verificar que es base64 válido
        if ',' in file_base64:
            header, encoded = file_base64.split(',', 1)
        else:
            encoded = file_base64
        
        decoded = base64.b64decode(encoded)
        if len(decoded) > 10 * 1024 * 1024:  # Máximo 10MB
            return {'message': 'El archivo es demasiado grande (máx 10MB)'}, 400
        
        # Guardar como data URI completa
        cv_url = file_base64 if ',' in file_base64 else f"data:application/pdf;base64,{file_base64}"
        
        new_cv = CV(cv_url=cv_url, user_id=user_id)
        db.session.add(new_cv)
        db.session.commit()
        
        return {'results': new_cv.serialize(), 'message': 'CV subido exitosamente'}, 201
    
    except Exception as e:
        return {'message': f'Error procesando archivo: {str(e)}'}, 400


# --- UTILS ---
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({'message': "Backend is running"}), 200