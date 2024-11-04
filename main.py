import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))

import logging

from fga.settings import properties
from fga.frameworks.flask import core as fga_core

app = None

def set_log_level():
    if os.environ.get('GAE_ENV') == 'fga-local':
        logging.basicConfig(level=logging.INFO)
    else:
        import google.cloud.logging
        client = google.cloud.logging.Client()
        client.setup_logging(
            log_level=logging.DEBUG if properties.environment_name() == 'dev' else logging.INFO
        )


def register_static_files_routes_for_local_development(app):
    if os.environ.get('GAE_ENV') == 'fga-local':
        from fga.frameworks.flask.local import register_static_files_routes
        register_static_files_routes(app, 'deployables/dev/app.yaml')


def create_front_blueprint():
    import flask
    from fga.frameworks.flask import session
    from fga.frameworks.flask.core import BeforeRequestFlow

    front_bp = flask.Blueprint('front', __name__, template_folder='public')
    front_bp.before_request(BeforeRequestFlow(get_user_session=True))

    @front_bp.route('/', defaults={'path': ''})
    @front_bp.route('/<path:path>')
    def index(path):
        return flask.render_template(
            'index.html',
            title='Example',
            session=session.get_user_session(),
            environment=properties.environment_name()
        )

    return front_bp


def main():
    global app

    if app is None:
        app = fga_core.create_app()
        register_static_files_routes_for_local_development(app)
        app.register_blueprint(create_front_blueprint())
        set_log_level()


main()
