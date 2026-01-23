"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, CV, Job, Postulations
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
import re


api = Blueprint('api', __name__)
CORS(api)


def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    return len(password) >= 6


@api.route("/signup", methods=["POST"])
def signup():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    name = request.json.get("name", None)
    profesional_title = request.json.get("profesional_title", "")
    
    if not email or not password or not name:
        response_body['message'] = "Email, password y nombre son requeridos"
        return response_body, 400
    
    if not validate_email(email):
        response_body['message'] = "Formato de email inválido"
        return response_body, 400
    
    if not validate_password(password):
        response_body['message'] = "La contraseña debe tener al menos 6 caracteres"
        return response_body, 400
    
    row = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if row:
        response_body['message'] = "El email ya está registrado"
        return response_body, 409
    
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
    claims = {'user_id': user['id']}
    response_body['message'] = 'Usuario registrado exitosamente'
    response_body['results'] = user
    response_body['access_token'] = create_access_token(identity=email, additional_claims=claims)
    return response_body, 201


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if not email or not password:
        response_body['message'] = "Email y contraseña son requeridos"
        return response_body, 400
    
    row = db.session.execute(db.select(Users).where(Users.email == email.lower().strip())).scalar()
    if not row:
        response_body['message'] = "Credenciales inválidas"
        return response_body, 401
    
    if not check_password_hash(row.password, password):
        response_body['message'] = "Credenciales inválidas"
        return response_body, 401
    
    user = row.serialize()
    claims = {'user_id': user['id']}
    response_body['message'] = 'Login exitoso'
    response_body['results'] = user
    response_body['access_token'] = create_access_token(identity=email, additional_claims=claims)
    return response_body, 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    response_body = {}
    current_user = get_jwt_identity()
    additional_claims = get_jwt()
    response_body['message'] = "Autorizado para ver esta información"
    response_body['results'] = current_user
    response_body['user_id'] = additional_claims['user_id']
    return response_body, 200


@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    if current_user_id != user_id:
        response_body['message'] = 'No autorizado para ver este perfil'
        return response_body, 403
    
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    response_body['results'] = row.serialize()
    response_body['message'] = f'Detalles del usuario {user_id}'
    return response_body, 200


@api.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    if current_user_id != user_id:
        response_body['message'] = 'No autorizado para actualizar este perfil'
        return response_body, 403
    
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    
    data = request.json
    if 'name' in data:
        row.name = data['name'].strip()
    if 'profesional_title' in data:
        row.profesional_title = data['profesional_title'].strip()
    if 'email' in data:
        new_email = data['email'].lower().strip()
        if new_email != row.email:
            existing_user = db.session.execute(db.select(Users).where(Users.email == new_email)).scalar()
            if existing_user:
                response_body['message'] = 'El email ya está en uso'
                return response_body, 409
            row.email = new_email
    
    db.session.commit()
    response_body['results'] = row.serialize()
    response_body['message'] = f'Usuario {user_id} actualizado exitosamente'
    return response_body, 200


@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    if current_user_id != user_id:
        response_body['message'] = 'No autorizado para eliminar este usuario'
        return response_body, 403
    
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
   
    db.session.execute(db.delete(Postulations).where(Postulations.user_id == user_id))
    db.session.execute(db.delete(CV).where(CV.user_id == user_id))
    db.session.execute(db.delete(Job).where(Job.user_id == user_id))
    db.session.delete(row)
    db.session.commit()
    
    response_body['message'] = f'Usuario {user_id} eliminado exitosamente'
    return response_body, 200


@api.route('/users/<int:user_id>/cvs', methods=['GET'])
@jwt_required()
def get_user_cvs(user_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    if current_user_id != user_id:
        response_body['message'] = 'No autorizado para ver estos CVs'
        return response_body, 403
    
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    
    rows = db.session.execute(db.select(CV).where(CV.user_id == user_id)).scalars()
    results = [row.serialize() for row in rows]
    response_body['results'] = results
    response_body['message'] = f'Listado de CVs del usuario {user_id}'
    return response_body, 200


@api.route('/cv', methods=['POST'])
@jwt_required()
def create_cv():
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    data = request.json
    cv_url = data.get('cv_url', None)
    user_id = data.get('user_id', None)
    
    if not cv_url or not user_id:
        response_body['message'] = 'cv_url y user_id son requeridos'
        return response_body, 400
    
    if current_user_id != user_id:
        response_body['message'] = 'No autorizado para crear CV para este usuario'
        return response_body, 403
    
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    
    if not cv_url.startswith(('http://', 'https://')):
        response_body['message'] = 'URL del CV inválida'
        return response_body, 400
    
    new_cv = CV(cv_url=cv_url.strip(), user_id=user_id)
    db.session.add(new_cv)
    db.session.commit()
    
    response_body['results'] = new_cv.serialize()
    response_body['message'] = 'CV creado exitosamente'
    return response_body, 201


@api.route('/cv/<int:cv_id>', methods=['DELETE'])
@jwt_required()
def delete_cv(cv_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    row = db.session.execute(db.select(CV).where(CV.id == cv_id)).scalar()
    if not row:
        response_body['message'] = 'CV no encontrado'
        return response_body, 404
    
    if row.user_id != current_user_id:
        response_body['message'] = 'No autorizado para eliminar este CV'
        return response_body, 403
    
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f'CV {cv_id} eliminado'
    return response_body, 200


@api.route('/jobs', methods=['GET'])
def get_jobs():
    response_body = {}
    location = request.args.get('location')
    company = request.args.get('company')
    
    query = db.select(Job)
    
    if location:
        query = query.where(Job.location.ilike(f'%{location}%'))
    if company:
        query = query.where(Job.company.ilike(f'%{company}%'))
    
    rows = db.session.execute(query).scalars()
    results = [row.serialize() for row in rows]
    response_body['results'] = results
    response_body['message'] = 'Listado de trabajos'
    return response_body, 200


@api.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    response_body = {}
    row = db.session.execute(db.select(Job).where(Job.id == job_id)).scalar()
    if not row:
        response_body['message'] = 'Trabajo no encontrado'
        return response_body, 404
    
    job_detail = {
        'id': row.id,
        'title': row.title,
        'company': row.company,
        'link': row.link,
        'about_job': row.about_job,
        'accountabilities': row.accountabilities,
        'requirements': row.requirements,
        'benefits': row.benefits,
        'salary': row.salary,
        'location': row.location,
        'notes': row.notes,
        'description': row.description,
        'created_at': row.created_at
    }
    response_body['results'] = job_detail
    response_body['message'] = f'Detalles del trabajo {job_id}'
    return response_body, 200


@api.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    response_body = {}
    data = request.json
    
    if not data or not data.get('title') or not data.get('company'):
        response_body['message'] = 'title y company son requeridos'
        return response_body, 400
    
    new_job = Job(
        title=data.get('title').strip(),
        company=data.get('company').strip(),
        link=data.get('link', '').strip(),
        about_job=data.get('about_job', '').strip(),
        accountabilities=data.get('accountabilities', '').strip(),
        requirements=data.get('requirements', '').strip(),
        benefits=data.get('benefits', '').strip(),
        salary=data.get('salary', '').strip(),
        location=data.get('location', '').strip(),
        notes=data.get('notes', '').strip(),
        description=data.get('description', '').strip()
    )
    
    db.session.add(new_job)
    db.session.commit()
    
    response_body['results'] = new_job.serialize()
    response_body['message'] = 'Trabajo creado exitosamente'
    return response_body, 201


@api.route('/jobs/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    response_body = {}
    row = db.session.execute(db.select(Job).where(Job.id == job_id)).scalar()
    if not row:
        response_body['message'] = 'Trabajo no encontrado'
        return response_body, 404
    
    data = request.json
    updatable_fields = [
        'title', 'company', 'link', 'about_job', 'accountabilities',
        'requirements', 'benefits', 'salary', 'location', 'notes', 'description'
    ]
    
    for field in updatable_fields:
        if field in data:
            setattr(row, field, data[field].strip() if isinstance(data[field], str) else data[field])
    
    db.session.commit()
    response_body['results'] = row.serialize()
    response_body['message'] = f'Trabajo {job_id} actualizado'
    return response_body, 200


@api.route('/jobs/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    response_body = {}
    row = db.session.execute(db.select(Job).where(Job.id == job_id)).scalar()
    if not row:
        response_body['message'] = 'Trabajo no encontrado'
        return response_body, 404
    
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f'Trabajo {job_id} eliminado'
    return response_body, 200


@api.route('/users/<int:user_id>/postulations', methods=['GET'])
@jwt_required()
def get_user_postulations(user_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    if current_user_id != user_id:
        response_body['message'] = 'No autorizado para ver estas postulaciones'
        return response_body, 403
    
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    
    rows = db.session.execute(db.select(Postulations).where(Postulations.user_id == user_id)).scalars()
    results = []
    
    for postulation in rows:
        job = postulation.job_to
        cv = postulation.cv_to
        
        postulation_data = {
            'id': postulation.id,
            'name': postulation.name,
            'status': postulation.status,
            'interview_date': postulation.interview_date.isoformat() if postulation.interview_date else None,
            'created_at': postulation.created_at.isoformat() if hasattr(postulation, 'created_at') else None,
            'job': {
                'id': job.id if job else None,
                'title': job.title if job else None,
                'company': job.company if job else None,
                'location': job.location if job else None
            },
            'cv': {
                'id': cv.id if cv else None,
                'cv_url': cv.cv_url if cv else None
            }
        }
        results.append(postulation_data)
    
    response_body['results'] = results
    response_body['message'] = f'Listado de postulaciones del usuario {user_id}'
    return response_body, 200


@api.route('/postulations', methods=['POST'])
@jwt_required()
def create_postulation():
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    data = request.json
    user_id = data.get('user_id', None)
    job_id = data.get('job_id', None)
    cv_id = data.get('cv_id', None)
    name = data.get('name', '').strip()
    status = data.get('status', 'Applied').strip()
    
    if not user_id or not job_id or not cv_id:
        response_body['message'] = 'user_id, job_id y cv_id son requeridos'
        return response_body, 400
    
    if current_user_id != user_id:
        response_body['message'] = 'No autorizado para crear postulación para este usuario'
        return response_body, 403
    
    user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not user:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    
    job = db.session.execute(db.select(Job).where(Job.id == job_id)).scalar()
    if not job:
        response_body['message'] = 'Trabajo no encontrado'
        return response_body, 404
    
    cv = db.session.execute(db.select(CV).where(CV.id == cv_id)).scalar()
    if not cv:
        response_body['message'] = 'CV no encontrado'
        return response_body, 404
    
    if cv.user_id != user_id:
        response_body['message'] = 'El CV no pertenece al usuario especificado'
        return response_body, 400
    
    if not name:
        name = f"Postulación de {user.name}"
    
    new_postulation = Postulations(
        name=name,
        status=status,
        user_id=user_id,
        job_id=job_id,
        cv_id=cv_id
    )
    
    db.session.add(new_postulation)
    db.session.commit()
    
    response_body['results'] = new_postulation.serialize()
    response_body['message'] = 'Postulación creada exitosamente'
    return response_body, 201


@api.route('/postulations/<int:postulation_id>', methods=['GET'])
@jwt_required()
def get_postulation(postulation_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    row = db.session.execute(db.select(Postulations).where(Postulations.id == postulation_id)).scalar()
    if not row:
        response_body['message'] = 'Postulación no encontrada'
        return response_body, 404
    
    if row.user_id != current_user_id:
        response_body['message'] = 'No autorizado para ver esta postulación'
        return response_body, 403
    
    job = row.job_to
    cv = row.cv_to
    user = row.user_to
    
    result = {
        'id': row.id,
        'name': row.name,
        'status': row.status,
        'interview_date': row.interview_date.isoformat() if row.interview_date else None,
        'created_at': row.created_at.isoformat() if hasattr(row, 'created_at') else None,
        'user': {
            'id': user.id if user else None,
            'name': user.name if user else None,
            'email': user.email if user else None
        },
        'job': {
            'id': job.id if job else None,
            'title': job.title if job else None,
            'company': job.company if job else None,
            'location': job.location if job else None,
            'salary': job.salary if job else None
        },
        'cv': {
            'id': cv.id if cv else None,
            'cv_url': cv.cv_url if cv else None
        }
    }
    
    response_body['results'] = result
    response_body['message'] = f'Detalles de la postulación {postulation_id}'
    return response_body, 200


@api.route('/postulations/<int:postulation_id>/status', methods=['PATCH'])
@jwt_required()
def update_postulation_status(postulation_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    row = db.session.execute(db.select(Postulations).where(Postulations.id == postulation_id)).scalar()
    if not row:
        response_body['message'] = 'Postulación no encontrada'
        return response_body, 404
    
    if row.user_id != current_user_id:
        response_body['message'] = 'No autorizado para actualizar esta postulación'
        return response_body, 403
    
    data = request.json
    
    if 'status' in data:
        row.status = data['status'].strip()
    
    if 'interview_date' in data:
        if data['interview_date']:
            try:
                from datetime import datetime
                row.interview_date = datetime.fromisoformat(data['interview_date'].replace('Z', '+00:00'))
            except ValueError:
                response_body['message'] = 'Formato de fecha inválido. Use ISO 8601'
                return response_body, 400
        else:
            row.interview_date = None
    
    db.session.commit()
    response_body['results'] = row.serialize()
    response_body['message'] = f'Postulación {postulation_id} actualizada'
    return response_body, 200


@api.route('/postulations/<int:postulation_id>', methods=['DELETE'])
@jwt_required()
def delete_postulation(postulation_id):
    response_body = {}
    current_user_id = get_jwt()['user_id']
    
    row = db.session.execute(db.select(Postulations).where(Postulations.id == postulation_id)).scalar()
    if not row:
        response_body['message'] = 'Postulación no encontrada'
        return response_body, 404
    
    if row.user_id != current_user_id:
        response_body['message'] = 'No autorizado para eliminar esta postulación'
        return response_body, 403
    
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f'Postulación {postulation_id} eliminada'
    return response_body, 200


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return response_body, 200
