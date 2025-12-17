import os
import inspect
from flask_admin import Admin
from flask_admin import BaseView, expose
from . import models
from .models import db
from flask_admin.contrib.sqla import ModelView
from flask import render_template


class ReadableModelView(ModelView):
    # show primary key and allow details view (click row to view)
    column_display_pk = True
    can_view_details = True
    details_modal = True
    can_export = True
    page_size = 50


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin')

    class DevToolsView(BaseView):
        @expose('/')
        def index(self):
            return render_template('dev_tools_admin.html')

    # Add specific configuration for known models (User) for nicer table layout
    try:
        User = models.User
        admin.add_view(ReadableModelView(User, db.session,
                                         column_list=(
                                             'id', 'email', 'first_name', 'last_name', 'is_active'),
                                         column_searchable_list=(
                                             'email', 'first_name', 'last_name'),
                                         column_filters=('is_active',),
                                         name='Users'))
        admin.add_view(DevToolsView(name='Dev Tools', endpoint='devtools'))
    except Exception:
        # fallback: add all models discovered dynamically
        for name, obj in inspect.getmembers(models):
            if inspect.isclass(obj) and issubclass(obj, db.Model):
                admin.add_view(ReadableModelView(obj, db.session))
