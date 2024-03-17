"""
This file made by Brian
It serves some static content from Postgres
"""

from flask import Blueprint, send_file
from io import BytesIO
from backend.db_queries import db_connection_pool

blueprint_db_static = Blueprint("blueprint_db_static", __name__)

@blueprint_db_static.route('/pfp/<id>', methods=['GET'])
def pfp(id):
    """BRIAN:
    Serve profile pictures by id. In the event an invalid id is provided it serves the one with ID 1 - the default. 
    """
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
        
@blueprint_db_static.route('/brand/<id>/logo.svg', methods=['GET'])
def brand_logo(id):
    """BRIAN:
    Serve brand pictures by brand id. In the event an invalid id is provided it serves the one with ID 96 - the factory.
    """
    with db_connection_pool.connection() as conn:
        id = id[:8] # get the first 8 characters. max id becomes 99,999,999
        try:
            id = int(id)
        except ValueError:
            id = 96
        cursor = conn.execute("""  
                            SELECT COALESCE(
                                (   
                                    SELECT img 
                                    FROM profile_pictures p 
                                    JOIN manufacturers m ON m.id=p.manufacturer_id
                                    WHERE m.id=%s
                                    ORDER BY p.id
                                    LIMIT 1
                                ),
                                (SELECT img FROM profile_pictures WHERE id = 96)
                            )"""
                        , (id,))
        return send_file(
            BytesIO(cursor.fetchone()[0]),
            mimetype='image/svg+xml'
        )