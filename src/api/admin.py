
import os
from flask_admin import Admin
from .models import db, User, Tareas, TareasAsignadas, Mision, Evento, Prioridad, Estado, Perfil, Grupo, Categoria, Clan
from flask_admin.contrib.sqla import ModelView


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
    admin.add_view(ModelView(Perfil, db.session))
    admin.add_view(ModelView(Tareas, db.session))
    admin.add_view(ModelView(TareasAsignadas, db.session))
    admin.add_view(ModelView(Mision, db.session))
    admin.add_view(ModelView(Evento, db.session))
    admin.add_view(ModelView(Prioridad, db.session))
    admin.add_view(ModelView(Estado, db.session))
    admin.add_view(ModelView(Grupo, db.session))
    admin.add_view(ModelView(Clan, db.session))
    admin.add_view(ModelView(Categoria, db.session))
    

    
