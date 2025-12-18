"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_cors import CORS as _CORS
from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

load_dotenv()
if not os.path.exists('.env'):
    load_dotenv('.env.example')

_CORS(app)
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix='/api')


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') or os.getenv('JWT_SECRET', 'super-secret-key')


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    from api.models import User
    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Usuario ya existe'}), 400
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    user = User(email=email, password=hashed_password,
                first_name=first_name, last_name=last_name, is_active=True)
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'Usuario creado'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    from api.models import User
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'msg': 'Credenciales inválidas'}), 401
    access_token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(minutes=15)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    refresh_token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'type': 'refresh'
    }, app.config['SECRET_KEY'], algorithm='HS256')

    if isinstance(access_token, bytes):
        access_token = access_token.decode('utf-8')
    if isinstance(refresh_token, bytes):
        refresh_token = refresh_token.decode('utf-8')

    return jsonify({'token': access_token, 'refresh_token': refresh_token})


@app.route('/refresh', methods=['POST'])
def refresh():
    data = request.get_json() or {}
    refresh_token = data.get('refresh_token')
    if not refresh_token:
        return jsonify({'msg': 'Refresh token requerido'}), 400
    try:
        payload = jwt.decode(
            refresh_token, app.config['SECRET_KEY'], algorithms=['HS256'])
        if payload.get('type') != 'refresh':
            return jsonify({'msg': 'Token inválido'}), 401
        from api.models import User
        user = User.query.get(payload.get('user_id'))
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        access_token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(minutes=15)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        if isinstance(access_token, bytes):
            access_token = access_token.decode('utf-8')
        return jsonify({'token': access_token})
    except jwt.ExpiredSignatureError:
        return jsonify({'msg': 'Refresh token expirado'}), 401
    except Exception:
        return jsonify({'msg': 'Refresh token inválido'}), 401


@app.route('/private', methods=['GET'])
def private():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'msg': 'Token requerido'}), 401
    try:
        token = auth_header.split(' ')[1]
        data = jwt.decode(
            token, app.config['SECRET_KEY'], algorithms=['HS256'])
        from api.models import User
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
        return jsonify({'msg': 'Acceso permitido', 'email': user.email})
    except Exception:
        return jsonify({'msg': 'Token inválido'}), 401
@app.route('/')
def index():
    return '''
    <html>
    <head>
        <title>Rigo welcomes you to your API!!</title>
        <script>
        async function showEndpoint(path, method = 'GET') {
            let body = null;
            let headers = {};
            if(path === '/signup') {
                method = 'POST';
                body = JSON.stringify({email: '', password: ''});
                headers['Content-Type'] = 'application/json';
            }
            if(path === '/login') {
                method = 'POST';
                body = JSON.stringify({email: '', password: ''});
                headers['Content-Type'] = 'application/json';
            }
            if(path === '/private') {
                method = 'GET';
                let token = window.sessionStorage.getItem('token');
                if(token) headers['Authorization'] = 'Bearer ' + token;
            }
            let res = await fetch(path, {method, headers, body});
            let text = await res.text();
            try { text = JSON.stringify(JSON.parse(text), null, 2); } catch(e){}
            if(path === '/login' && res.ok) {
                try {
                    let data = JSON.parse(text);
                    if(data.token) window.sessionStorage.setItem('token', data.token);
                } catch(e){}
            }
            document.getElementById('response').innerText = text;
        }
        </script>
    </head>
    <body style="font-family:sans-serif;text-align:center;">
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <input value="http://localhost:3001" readonly style="width:300px;text-align:center;" /></p>
        <p>Start working on your project by following the <a href="https://github.com/4GeeksAcademy/react-flask-hello">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like:</p>
        <div style="display:flex; justify-content:flex-start;">
            <ul style="text-align:left; display:block; margin-left:0;">
                <li><a href="#" onclick="showEndpoint('/admin/');return false;">/admin/</a></li>
                <li><a href="#" onclick="showEndpoint('/signup');return false;">/signup</a></li>
                <li><a href="#" onclick="showEndpoint('/login');return false;">/login</a></li>
                <li><a href="#" onclick="showEndpoint('/private');return false;">/private</a></li>
            </ul>
        </div>
        <pre id="response" style="text-align:left; background:#f4f4f4; padding:1em; margin:2em; border-radius:8px; min-height:100px;"></pre>
    </body>
    </html>
    '''


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
