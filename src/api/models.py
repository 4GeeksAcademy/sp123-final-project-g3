from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    photo: Mapped[str] = mapped_column(String(255), nullable=True)
    bio: Mapped[str] = mapped_column(String(250), nullable=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    city: Mapped[str] = mapped_column(String(80), nullable=True)
    gender: Mapped[str] = mapped_column(String(80), nullable=True)
    twitter: Mapped[str] = mapped_column(String(80), nullable=True)
    facebook: Mapped[str] = mapped_column(String(80), nullable=True)
    instagram: Mapped[str] = mapped_column(String(80), nullable=True)
    db_clan_user: Mapped[list['Clan']] = relationship(
        back_populates='db_user_clan')
    db_tareas_asignadas_user: Mapped[list['TareasAsignadas']] = relationship(
        back_populates='db_user_tareas_asignadas')

    def __repr__(self):
        return f'{self.email}'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "photo": self.photo,
            "bio": self.bio,
            "phone": self.phone,
            "age": self.age,
            "city": self.city,
            "gender": self.gender,
            "twitter": self.twitter,
            "facebook": self.facebook,
            "instagram": self.instagram,
        }


class Task(db.Model):
    __tablename__ = 'Task'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(80), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    description: Mapped[str] = mapped_column(String(250), nullable=True)
    lat: Mapped[str] = mapped_column(String(255), nullable=True)
    lng: Mapped[str] = mapped_column(String(255), nullable=True)

    def __repr__(self):
        return f'{self.title}'

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "date": self.date,
            "description": self.description,
            "lat": self.lat,
            "lng": self.lng
        }


class Estado(db.Model):
    __tablename__ = 'estado'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tipo: Mapped[str] = mapped_column(String(20), nullable=True)
    db_tareas_estado: Mapped[list['Tareas']] = relationship(
        back_populates='db_estado_tareas')

    def __repr__(self):
        return f'{self.tipo}'

    def serialize(self):
        return {
            "id": self.id,
            "tipo": self.tipo
        }


class Evento(db.Model):
    __tablename__ = 'evento'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String(20), nullable=False)
    lugar: Mapped[str] = mapped_column(String(100), nullable=False)
    db_tareas_evento: Mapped[list['Tareas']] = relationship(
        back_populates='db_evento_tareas')

    def __repr__(self):
        return f'{self.titulo}'

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "lugar": self.lugar
        }


class Prioridad(db.Model):
    __tablename__ = 'prioridad'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nivel: Mapped[str] = mapped_column(String(20), nullable=False)
    db_tareas_prioridad: Mapped[list['Tareas']] = relationship(
        back_populates='db_prioridad_tareas')

    def __repr__(self):
        return f'{self.nivel}'

    def serialize(self):
        return {
            "id": self.id,
            "nivel": self.nivel,
        }


class Grupo(db.Model):
    __tablename__ = 'grupo'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False)
    categoria_id: Mapped[int] = mapped_column(ForeignKey('categoria.id'))
    db_categoria_grupo: Mapped['Categoria'] = relationship(
        back_populates='db_grupo_categoria')
    fecha: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    codigo: Mapped[int] = mapped_column(Integer, nullable=True)
    db_clan_grupo: Mapped[list['Clan']] = relationship(
        back_populates='db_grupo_clan')
    db_mision_grupo: Mapped[list['Mision']] = relationship(
        back_populates='db_grupo_mision')

    def __repr__(self):
        return f'{self.nombre}'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "categoria_id": self.categoria_id,
            "fecha": self.fecha,
            "codigo": self.codigo
        }


class Categoria(db.Model):
    __tablename__ = 'categoria'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)
    db_grupo_categoria: Mapped[list['Grupo']] = relationship(
        back_populates='db_categoria_grupo')

    def __repr__(self):
        return f'{self.nombre}'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
        }


class Clan(db.Model):
    __tablename__ = 'clan'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    db_user_clan: Mapped['User'] = relationship(back_populates='db_clan_user')
    grupo_id: Mapped[int] = mapped_column(ForeignKey('grupo.id'))
    db_grupo_clan: Mapped['Grupo'] = relationship(
        back_populates='db_clan_grupo')

    def __repr__(self):
        return f'User = {self.user_id} y Grupo = {self.grupo_id}'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "grupo_id": self.grupo_id
        }


class Mision(db.Model):
    __tablename__ = 'mision'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tareas_id: Mapped[int] = mapped_column(ForeignKey('tareas.id'))
    db_tareas_mision: Mapped['Tareas'] = relationship(
        back_populates='db_mision_tareas')
    grupo_id: Mapped[int] = mapped_column(ForeignKey('grupo.id'))
    db_grupo_mision: Mapped['Grupo'] = relationship(
        back_populates='db_mision_grupo')

    def __repr__(self):
        return f'Grupo = {self.grupo_id} y Tarea = {self.tareas_id}'

    def serialize(self):
        return {
            "id": self.id,
            "tareas_id": self.tareas_id,
            "grupo_id": self.grupo_id
        }


class TareasAsignadas(db.Model):
    __tablename__ = 'tareas_asignadas'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    db_user_tareas_asignadas: Mapped['User'] = relationship(
        back_populates='db_tareas_asignadas_user')
    tareas_id: Mapped[int] = mapped_column(ForeignKey('tareas.id'))
    db_tareas_tareas_asignadas: Mapped['Tareas'] = relationship(
        back_populates='db_tareas_asignadas_tareas')

    def __repr__(self):
        return f'User = {self.user_id} y Tarea = {self.tareas_id}'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "tareas_id": self.tareas_id
        }
