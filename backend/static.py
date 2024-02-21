from flask import Blueprint, send_file
from io import BytesIO
from backend.db_queries import db_connection_pool

blueprint_db_static = Blueprint("blueprint_db_static", __name__)

@blueprint_db_static.route('/pfp/<id>', methods=['GET'])
def pfp(id):
    connection = db_connection_pool.getconn()
    try:
        with connection.cursor() as cursor:
            id = id[:9] # get the first 9 characters. max id becomes 999,999,999
            try:
                id = int(id)
            except ValueError:
                id = 1
            cursor.execute("""  
                                SELECT COALESCE(
                                    (SELECT img FROM profile_pictures WHERE id = %s),
                                    (SELECT img FROM profile_pictures WHERE id = 1)
                                )"""
                           , (id,))
            
            return send_file(
                BytesIO(cursor.fetchone()[0]),
                mimetype='image/png'
            )
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)
        