"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from datetime import datetime, timedelta
import os

from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import jwt_required, get_jwt_identity

from flask_cors import CORS

from api.utils import APIException, generate_sitemap
from api.models import db, User, Activity, Message, PasswordResetToken
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from flask_bcrypt import Bcrypt

from flask_mail import Mail, Message

from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import jwt

load_dotenv()

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False


# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=False,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

VITE_FRONTEND_URL = os.getenv("VITE_FRONTEND_URL")

jwt = JWTManager(app)

bcrypt = Bcrypt(app)


#Configuración Flask-Mail ----------------------------------------
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER")

mail = Mail(app)


#Helper para generar token JWT-----------------------------------------
def generate_reset_token(user_id: int) -> str:
    serializer = URLSafeTimedSerializer(app.config["JWT_SECRET_KEY"])
    return serializer.dumps({"user_id": user_id})

def verify_reset_token(token: str, max_age_seconds: int = 900):  # 15 minutos
    serializer = URLSafeTimedSerializer(app.config["JWT_SECRET_KEY"])
    try:
        data = serializer.loads(token, max_age=max_age_seconds)
        return data.get("user_id")
    except SignatureExpired:
        return None
    except BadSignature:
        return None
#Fin del Helper para generar token JWT-----------------------------------------



# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({
        "message": "Hola desde el backend!",
        "quote": "Sigue entrenando, vas por buen camino"
    }), 200


# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# Endpoint: prueba envio correo -------------------------------
@app.route("/test-email")
def test_email():
    try:
        msg = Message(
            subject="Prueba de correo",
            sender=os.getenv("MAIL_DEFAULT_SENDER"),
            recipients=[os.getenv("MAIL_USERNAME")],
            body="Este es un correo de prueba."
        )
        mail.send(msg)
        return {"status": "ok", "message": "Correo enviado correctamente"}
    except Exception as e:
        print("ERROR:", e)
        return {"status": "error", "details": str(e)}, 500



# Endpoint: solicitar recuperación -------------------------------
@app.route("/api/forgot", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify({"error": "Introduce tu email."}), 400

    user = User.query.filter_by(email=email).first()

    # Siempre devolvemos el mismo mensaje para no exponer información
    message = "Si existe el email, recibirás instrucciones para restablecer la contraseña."

    if not user:
        return jsonify({"message": message}), 200

    # Generar token
    token = generate_reset_token(user.id)
    reset_link = f"{os.getenv('VITE_FRONTEND_URL')}/reset/{token}"

    # Email HTML
    html_body = f"""
        <p>Hola,</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <p><a href="{reset_link}">{reset_link}</a></p>
        <p>Si no solicitaste esto, ignora este mensaje.</p>
    """

    try:
        msg = Message(
            "Restablece tu contraseña",
            recipients=[email],
            html=html_body
        )
        mail.send(msg)
    except Exception as e:
        # No informamos del error al usuario, por seguridad
        app.logger.error(f"Error enviando email: {str(e)}")

    return jsonify({"message": message}), 200

# Endpoint: restablecer contraseña------------------------------------
@app.route("/api/reset/<token>", methods=["POST"])
def reset_password(token):
    data = request.json
    new_password = data.get("password")
    if not new_password:
        return jsonify({"error": "Introduce la nueva contraseña."}), 400

    user_id = verify_reset_token(token)
    if not user_id:
        return jsonify({"error": "Token inválido o expirado."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado."}), 400

    user.password = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Contraseña restablecida correctamente."}), 200
#FIN DE FORGOT PASSWORD Y RESET PASSWORD --------------------------------------

#REPORTAR USUARIO
@app.route('/api/report_user/<int:user_id>', methods=['POST'])
@jwt_required()
def report_user(user_id):
    try:
        current_user_id = get_jwt_identity()

        #evitar auto-reportes
        if current_user_id == user_id:
            return jsonify({"msg": "No puedes reportarte a ti mismo"}), 400

        #buscar usuario
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        #iniciar contador si no existe
        if not hasattr(user, "reports") or user.reports is None:
            user.reports = 0

        #incrementa reportes
        user.reports += 1

        #contador de reportes = mayor o igual a 3 = usuario bloqueado
        if user.reports >= 3:
            user.is_blocked = True

        db.session.commit()

        return jsonify({
            "msg": f"El usuario {user.name} ha sido reportado correctamente.",
            "reports": user.reports,
            "is_blocked": user.is_blocked
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Error al reportar usuario.",
            "error": str(e)
        }), 500


#BLOQUEAR USUARIO
@app.route('/api/block_user/<int:user_id>', methods=['POST'])
@jwt_required()
def block_user(user_id):
    try:
        current_user_id = get_jwt_identity()

        #paso básico a seguir
        if current_user_id == user_id:
            return jsonify({"msg": "No puedes bloquearte a ti mismo"}), 400

        #buscar usuario a bloquear
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        # Ejemplo opcional: si tu modelo tiene un campo is_admin
        current_user = User.query.get(current_user_id)
        if hasattr(current_user, "is_admin") and not current_user.is_admin:
            return jsonify({"msg": "No tienes permisos para bloquear usuarios"}), 403

        # Bloquear usuario
        user.is_blocked = True
        db.session.commit()

        return jsonify({
            "msg": f"El usuario {user.name} ha sido bloqueado correctamente.",
            "is_blocked": user.is_blocked
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al bloquear usuario", "error": str(e)}), 500


@app.route('/api/register', methods=['POST'])
def register():
    body = request.get_json(silent=True)

    if body is None:
        return jsonify({'msg': 'POST method needs a body or email/password not found.'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'El campo email es obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'El campo password es obligatorio'}), 400
    if 'nombre' not in body:
        return jsonify({'msg': 'El campo nombre es obligatorio'}), 400
    if 'edad' not in body:
        return jsonify({'msg': 'El campo edad es obligatorio'}), 400
    if 'apellidos' not in body:
        return jsonify({'msg': 'El campo apellidos es obligatorio'}), 400
    if 'telefono' not in body:
        return jsonify({'msg': 'El campo telefono es obligatorio'}), 400
    if 'genero' not in body:
        return jsonify({'msg': 'El campo Genero es obligatorio'}), 400

  
    email = body.get("email")
    password = body.get("password")
    nombre = body.get("nombre")
    edad = body.get("edad")
    apellidos = body.get("apellidos")
    telefono = body.get("telefono")
    genero = body.get("genero")

    user = User.query.filter_by(email=email).first()
    if user is not None:
        return jsonify({'msg': 'Error al registrar Usuario!'}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, name=nombre, password_hash=pw_hash,
                age=edad, lastname=apellidos, gender=genero, phone=telefono)
    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'User Registered successfully'})


@app.route('/api/login', methods=['POST'])
def login():

    body = request.get_json(silent=True)

    if body is None:
        return jsonify({'msg': 'POST method needs a body or email/password not found.'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'email field is mandatory'}), 400
    if 'password' not in body:
        return jsonify({'msg': 'password field is mandatory'}), 400
    # buscar usuario
    email = body['email']
    password = body['password']

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'msg': 'User or password incorrect'}), 400
    # validar password
    is_password = bcrypt.check_password_hash(user.password_hash, password)

    if not is_password:
        return jsonify({'msg': 'User or password incorrect'}), 400
    # crear token
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({'token' : access_token, "user": user.id})


@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():

    current_user = int(get_jwt_identity())
    user = User.query.get(current_user)
    print(user)
    return jsonify(user.serialize()), 200


# ENDPOINT DE ACTIVIDADES
@app.route("/api/activities", methods=["GET"])
def get_activities():
    activities = Activity.query.all()
    return jsonify([a.serialize() for a in activities]), 200


@app.route("/api/activities/<int:id>", methods=["GET"])
def get_activity(id):
    activity = Activity.query.get(id)
    if not activity:
        return jsonify({"error": "Actividad no encontrada"}), 404
    return jsonify(activity.serialize()), 200


@app.route("/api/activities", methods=["POST"])
@jwt_required()
def create_activity():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    required_fields = ["name", "sport","description", "date","latitude", "longitude" ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    activity = Activity(
        title=data["name"],
        sport=data["sport"],
        description=data.get("description"),
        max_participants=data.get("max_participants", 10),
        date = datetime.strptime(data["date"], "%Y-%m-%dT%H:%M"),
        latitude = float(data["latitude"]),
        longitude = float(data["longitude"]),
        created_by=user_id,
    )
    db.session.add(activity)
    db.session.commit()

    return jsonify({"msg": "Actividad creada", "activity": activity.serialize()}), 201


@app.route("/api/activities/<int:id>", methods=["PUT"])
@jwt_required()
def update_activity(id):
    user_id = int(get_jwt_identity())
    activity = Activity.query.get(id)
    if not activity:
        return jsonify({"error": "Actividad no encontrada"}), 404
    if activity.created_by != user_id:
        return jsonify({"error": "No autorizado"}), 403
    
    data = request.get_json()
    
    VALID_SPORTS = ["Running", "Ciclismo", "Fútbol", "Baloncesto", "Yoga", "Natación", "Crossfit"]

    if data["sport"] not in VALID_SPORTS:
        return jsonify({"error": "Deporte inválido"}), 400


    for key in ["title", "sport", "description", "date", "time", "max_participants"]:
        if key in data:
            setattr(activity, key, data[key])

    db.session.commit()
    return jsonify({"msg": "Actividad actualizada", "activity": activity.serialize()}), 200


@app.route("/api/activities/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_activity(id):
    user_id = int(get_jwt_identity())
    activity = Activity.query.get(id)
    if not activity:
        
        return jsonify({"error": "Actividad no encontrada", }), 404
    if activity.created_by != user_id:
        # print(type(user_id), type(activity.serialize()))
        return jsonify({"error": "No autorizado"}), 403

    db.session.delete(activity)
    db.session.commit()
    return jsonify({"msg": "Actividad eliminada"}), 200


@app.route("/api/activities/<int:id>/join", methods=["POST"])
@jwt_required()
def join_activity(id):
    user_id = int(get_jwt_identity())
    activity = Activity.query.get(id)
    if not activity:
        return jsonify({"error": "Actividad no encontrada"}), 404

    user = User.query.get(user_id)
    if user in activity.participants:
        return jsonify({"error": "Ya estás inscrito"}), 400

    if len(activity.participants) >= (activity.max_participants or 10):
        return jsonify({"error": "Cupo lleno"}), 400

    activity.participants.append(user)
    db.session.commit()

    return jsonify({"msg": "Te has unido a la actividad"}), 200


# Obtener todos los usuarios (GET)
@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    users_serialized = [user.serialize() for user in users]
    return jsonify(users_serialized), 200
    
# Obtener un usuario por ID (GET)
@app.route('/api/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = int(get_jwt_identity())
    try:
        current_user_id = int(current_user_id)
    except (TypeError, ValueError):
        return jsonify({'msg': 'Token inválido'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    return jsonify(user.serialize()), 200

# Editar usuario (PUT)
@app.route('/api/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def edit_user(user_id):
    current_user_id = int(get_jwt_identity())
    try:
        current_user_id = int(current_user_id)
    except (TypeError, ValueError):
        return jsonify({'msg': 'Token inválido'}), 401
    if current_user_id != user_id:
        return jsonify({'msg': 'No autorizado'}), 403

    body = request.get_json(silent=True)
    if body is None or not isinstance(body, dict):
        return jsonify({'msg': 'PUT necesita JSON en el body'}), 400

    user = User.query.get(user_id)
    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    if 'email' in body:
        new_email = str(body['email']).strip().lower()
        if not new_email:
            return jsonify({'msg': 'Email inválido'}), 400
        if User.query.filter(User.email == new_email, User.id != user_id).first():
            return jsonify({'msg': 'Email ya en uso'}), 400
        user.email = new_email

    if 'name' in body:
        name = str(body['name']).strip()
        if len(name) < 2:
            return jsonify({'msg': 'El nombre debe tener al menos 2 caracteres'}), 400
        user.name = name

    if 'lastname' in body:
        user.lastname = str(body['lastname']).strip()

    if 'age' in body:
        try:
            age = int(body['age'])
        except (TypeError, ValueError):
            return jsonify({'msg': 'Edad inválida'}), 400
        if age < 18 or age > 120:
            return jsonify({'msg': 'Debe ser mayor de edad'}), 400
        user.age = age

    if 'phone' in body:
        user.phone = str(body['phone']).strip()

    if 'gender' in body:
        gender = str(body['gender']).strip()
        if gender not in ('male', 'female', 'other'):
            return jsonify({'msg': "Género inválido (usa 'male' | 'female' | 'other')"}), 400
        user.gender = gender
        
        
    if 'bio' in body:
        bio = str(body['bio']).strip()
        if len(bio) < 2:
            return jsonify({'msg': 'La bio debe tener al menos 2 caracteres'}), 400
        user.biography = bio
        
    if 'sports' in body:
        user.sports = str(body['sports'])
    
    if 'level' in body:
        user.level = str(body['level'])

    db.session.commit()
    return jsonify({'msg': 'Usuario actualizado correctamente', 'user': user.serialize()}), 200


# Eliminar usuario (DELETE)
@app.route('/api/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = int(get_jwt_identity())
    try:
        current_user_id = int(current_user_id)
    except (TypeError, ValueError):
        return jsonify({'msg': 'Token inválido'}), 401
    if current_user_id != user_id:
        return jsonify({'msg': 'No autorizado'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    db.session.delete(user)
    db.session.commit()
    return ("", 204)


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
