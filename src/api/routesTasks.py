from flask import request, jsonify, Blueprint
import secrets
from datetime import datetime, timedelta, timezone
import jwt
from werkzeug.security import check_password_hash
from api.models import db, Tareas, TareasAsignadas, Mision, Evento, Prioridad, Estado, User
from werkzeug.security import generate_password_hash
from flask_cors import CORS

api_tasks = Blueprint('apiTasks', __name__)

# Allow CORS requests to this API
CORS(api_tasks)


@api_tasks.route('/tareas', methods=['GET'])
def get_tareas():
    varTareas = Tareas.query.all()
    tareas_serialized = []
    for cicloFor_varTareas in varTareas:
        tareas_serialized.append(cicloFor_varTareas.serialize())
    response_body = {
        "Lista de Tareas": tareas_serialized
    }
    return jsonify(response_body), 200


@api_tasks.route('/<int:user_id>/tareas', methods=['GET'])
def get_tareas_user(user_id):
    varUser = User.query.get(user_id)
    print(varUser)
    if varUser is None:
        return ({'msg': f'El usuario con ID {user_id} no existe'}), 404
    varTareas_lista = varUser.db_tareas_asignadas_user
    lista_tareas_serialized = []

    for cicloFor_varTareas_lista in varTareas_lista:
        tabla_tareas_asignadas = cicloFor_varTareas_lista.db_tareas_tareas_asignadas
        lista_tareas_serialized.append(tabla_tareas_asignadas.serialize())

    response_body = {
        "Lista de todas las Tareas del usario": lista_tareas_serialized
    }
    return jsonify(response_body), 200


@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>', methods=['POST'])
def asignar_tarea_user(user_id, tareas_id):
    varUser = User.query.get(user_id)
    varTareas = Tareas.query.get(tareas_id)

    if varUser is None:
        return jsonify({'msg': f'Usuario con ID {user_id} no existe'}), 404
    if varTareas is None:
        return jsonify({'msg': f'No hay Tarea con ID {tareas_id} Revisalo ramon'}), 404

    new_task = TareasAsignadas(user_id=user_id, tareas_id=tareas_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'msg': f'Se ha agregado la tarea {varTareas.titulo} correctamente en el Usuario {varUser.email}',
                    'Nueva Asignacion': new_task.serialize()}), 200


@api_tasks.route('/<int:user_id>/tareas', methods=['POST'])
def agregar_tarea_user(user_id):
    data = request.get_json()

    varUser = User.query.get(user_id)
    if varUser is None:
        return jsonify({"msg": f"Usuario con ID {user_id} no existe"}), 404

    titulo = data.get("titulo")
    descripcion = data.get("descripcion")
    fecha = data.get("fecha")
    evento_id = data.get("evento_id")
    prioridad_id = data.get("prioridad_id")
    estado_id = data.get("estado_id")
    imagen = data.get("imagen")

    if not titulo:
        return jsonify({"msg": "El título es obligatorio"}), 400

    nueva_tarea = Tareas(
        titulo=titulo,
        descripcion=descripcion,
        fecha=fecha,
        evento_id=evento_id,
        prioridad_id=prioridad_id,
        estado_id=estado_id,
        imagen=imagen
    )

    db.session.add(nueva_tarea)
    db.session.commit()

    asignacion = TareasAsignadas(
        user_id=user_id,
        tareas_id=nueva_tarea.id
    )

    db.session.add(asignacion)
    db.session.commit()

    return jsonify({
        "msg": f"Tarea '{titulo}' creada y asignada al usuario {varUser.email}",
        "tarea": nueva_tarea.serialize(),
        "asignacion": asignacion.serialize()
    }), 201


@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>/editar', methods=['PUT'])
def editar_tarea_user(user_id, tareas_id):
    varTarea = Tareas.query.get(tareas_id)
    varUser = User.query.get(user_id)
    if varTarea is None:
        return jsonify({'msg': f'La tarea con ID {tareas_id} no existe'}), 404
    if varUser is None:
        return jsonify({'msg': f'Usuario con ID {user_id} no existe'}), 404

    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'No se encuentra body, no hay datos que actualizar'}), 400

    if "titulo" in body:
        varTarea.titulo = body["titulo"]
    if "descripcion" in body:
        varTarea.descripcion = body["descripcion"]
    if "evento_id" in body:
        varTarea.evento_id = body["evento_id"]    

    if "estado" in body:
        estado_actual = body["estado"].strip()
        nuevo_estado = Estado.query.filter(
            Estado.tipo == estado_actual
        ).first()
        if nuevo_estado is None:
            return jsonify({'msg': f'El estado "{estado_actual}" no existe.'}), 404
        varTarea.estado_id = nuevo_estado.id
    
    if "fecha" in body:
        try:
            varTarea.fecha = datetime.fromisoformat(body["fecha"])
        except:
            return jsonify({'msg': 'Fecha incorrecta. Usa formato ISO: YYYY-MM-DD HH:MM:SS'}), 400

    if "imagen" in body:
        varTarea.imagen = body["imagen"]

    if "prioridad" in body:
        prioridad_actual = body["prioridad"].strip()
        nueva_prioridad = Prioridad.query.filter(
            Prioridad.nivel == prioridad_actual
        ).first()
        if nueva_prioridad is None:
            return jsonify({'msg': f'La prioridad "{prioridad_actual}" no existe.'}), 404
        varTarea.prioridad_id = nueva_prioridad.id

    db.session.commit()

    return jsonify({'msg': 'Se ha editado la Tarea Correctamente', 'Tarea': varTarea.serialize()}), 202

@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>/editar/eventos/<int:evento_id>', methods=['PUT'])
def editar_evento_user(user_id, tareas_id, evento_id):
    varTarea = Tareas.query.get(tareas_id)
    varUser = User.query.get(user_id)
    varEvento = Evento.query.get(evento_id)
    if varTarea is None:
        return jsonify({'msg': f'La tarea con ID {tareas_id} no existe'}), 404
    if varUser is None:
        return jsonify({'msg': f'Usuario con ID {user_id} no existe'}), 404
    if varEvento is None:
        return jsonify({'msg': f'El Evento con ID {evento_id} no existe'}), 404

    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'No se encuentra body, no hay datos que actualizar'}), 400

    if "titulo" in body:
        varEvento.titulo = body["titulo"]
    if "lugar" in body:
        varEvento.lugar = body["lugar"]  
    
    db.session.commit()

    return jsonify({'msg': 'Se ha editado el evento Correctamente', 'Evento': varEvento.serialize()}), 202

@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>/desasignar', methods=['DELETE'])
def desasignar_tarea(user_id, tareas_id):
    varUser = User.query.get(user_id)
    if varUser is None:
        return jsonify({'msg': f'El usuario con ID {user_id} no existe'}), 404

    varTareasAsignadas = TareasAsignadas.query.filter_by(
        user_id=user_id,
        tareas_id=tareas_id
    ).first()

    if varTareasAsignadas is None:
        return jsonify({'msg': 'La tarea no está asignada a este usuario'}), 404

    db.session.delete(varTareasAsignadas)
    db.session.commit()

    return jsonify({
        'msg': f'La tarea con ID {tareas_id} ha sido des-asignada del Usuario {user_id}'
    }), 200


@api_tasks.route('/<int:user_id>/tareas/<int:tareas_id>/eliminar', methods=['DELETE'])
def eliminar_tarea(user_id, tareas_id):

    varUser = User.query.get(user_id)
    if varUser is None:
        return jsonify({'msg': f'El usuario con ID {user_id} no existe'}), 404

    varTarea = Tareas.query.get(tareas_id)
    if varTarea is None:
        return jsonify({'msg': f'La tarea con ID {tareas_id} no existe'}), 404

    TareasAsignadas.query.filter_by(tareas_id=tareas_id).delete()

    db.session.delete(varTarea)
    db.session.commit()

    return jsonify({
        'msg': f'La tarea con ID {tareas_id} ha sido eliminada correctamente'
    }), 200


@api_tasks.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hola! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
