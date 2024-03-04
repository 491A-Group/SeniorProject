from flask import Blueprint, send_file
from io import BytesIO
from backend.db_queries import db_connection_pool

blueprint_db_static = Blueprint("blueprint_db_static", __name__)

@blueprint_db_static.route('/pfp/<id>', methods=['GET'])
def pfp(id):
    with db_connection_pool.connection() as conn:
        id = id[:9] # get the first 9 characters. max id becomes 999,999,999
        try:
            id = int(id)
        except ValueError:
            id = 1
        cursor = conn.execute("""  
                            SELECT COALESCE(
                                (SELECT img FROM profile_pictures WHERE id = %s),
                                (SELECT img FROM profile_pictures WHERE id = 1)
                            )"""
                        , (id,))
        return send_file(
            BytesIO(cursor.fetchone()[0]),
            mimetype='image/svg+xml'
        )
        