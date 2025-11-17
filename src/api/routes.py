"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import random
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    quotes = [
        "El deporte une a las personas más de lo que imaginamos.",
        "Entrenar juntos hace que cualquier reto sea más ligero.",
        "Compartir el esfuerzo crea conexiones más fuertes que los músculos.",
        "El mejor entrenamiento es el que haces con alguien que te inspira.",
        "Hacer deporte es increíble, pero hacerlo acompañado es aún mejor.",
        "Cuando entrenas con alguien, no solo mejoras tu cuerpo, también tu ánimo.",
        "El deporte no solo fortalece el cuerpo, también las relaciones.",
        "Cualquier deporte es bueno si lo practicas con buena compañía.",
        "La energía se multiplica cuando entrenamos en equipo.",
        "La motivación crece cuando no entrenas solo."
    ]

    response_body = {
        "message": "¡Mensaje especial del equipo MeetFit! Desliza hacia abajo para ver un quote motivador.",
        "quote": random.choice(quotes)
    }

    return jsonify(response_body), 200
