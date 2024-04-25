"""
This file made by Brian
It serves some static content from Postgres
"""

from flask import Blueprint, send_file
from io import BytesIO
from backend.db_queries import db_connection_pool

blueprint_db_static = Blueprint("blueprint_db_static", __name__)

def send_svg(svg):
    return send_file(
        BytesIO(svg),
        mimetype='image/svg+xml'
    )

# BRIAN: setting up a read-only cache for
#   profile pictures. This block of codes only runs once when this module is first loaded
print('loading pfp caches...')
import threading
pfp_groups = {}             #entry point, group_name is manufacturer name;       group_name: (manu_id, quantity)
pfp_cache_by_manu_id = {}   #manufacturer_id: [pfp_id1, pfp_id2, ..., pfp_idN]
pfp_cache_by_id = {}        #id: svg
pfp_cache_lock = threading.Lock()
# the following variables are only for use in the error cases in static.py
# other places like select pfp menu s can just find them lost in the dictionaries
DEFAULT_USER_SVG = None 
DEFAULT_MANU_SVG = None 
with pfp_cache_lock:
    results = None
    with db_connection_pool.connection() as conn:
        cursor = conn.execute(
            """
            SELECT p.id, p.img, m.id, m.name
            FROM profile_pictures p
            LEFT JOIN manufacturers m ON m.id = p.manufacturer_id
            ORDER BY p.id
            """
        )
        results = cursor.fetchall()
        if not results:
            print("\n\n!!Error fetching profile pictures upon startup!!\n")
        for index, result in enumerate(results):
            if result[2] is None:
                results[index] = (result[0], result[1], 0, 'Other') # fix the manu id and manu name. tuple doesn't allow modifying those values, so reassign the whole tuple
        # this comment is the end of cleaning up the results from the db query
        for pfp_id, pfp_svg, manu_id, manu_name in results:
            # this first if statement catches special cases; default pictures
            if pfp_id == 1:
                DEFAULT_USER_SVG = pfp_svg
            elif pfp_id == 96:
                DEFAULT_MANU_SVG = pfp_svg

            pfp_cache_by_id[pfp_id] = pfp_svg
            if manu_id not in pfp_cache_by_manu_id:
                pfp_groups[manu_name] = [manu_id, 0] # list while creating for easy mutability, turn to tuple later. (id, quantity)
                pfp_cache_by_manu_id[manu_id] = []
            pfp_groups[manu_name][1] += 1
            pfp_cache_by_manu_id[manu_id].append(pfp_id) 
    for key, values_list in pfp_groups.items():
        pfp_groups[key] = tuple(values_list)
print('done loading pfp caches.', len(pfp_groups), len(pfp_cache_by_manu_id), len(pfp_cache_by_id))
# END OF INIT STATIC CACHE



@blueprint_db_static.route('/pfp/<id>', methods=['GET'])
def pfp(id):
    """BRIAN:
    Serve profile pictures by id. In the event an invalid id is provided it serves the one with ID 1 - the default. 
    """
    id = id[:9] # get the first 9 characters. max id becomes 999,999,999
    try:
        id = int(id)
    except ValueError:
        return send_svg(DEFAULT_USER_SVG)
    
    if id in pfp_cache_by_id:
        return send_svg(pfp_cache_by_id[id])
    return send_svg(DEFAULT_USER_SVG)
        
@blueprint_db_static.route('/brand/<id>/logo.svg', methods=['GET'])
def brand_logo(id):
    """BRIAN:
    Serve brand pictures by brand id. In the event an invalid id is provided it serves the one with ID 96 - the factory.
    """
    id = id[:8] # get the first 8 characters. max id becomes 99,999,999
    try:
        id = int(id)
    except ValueError:
        return send_svg(DEFAULT_MANU_SVG)

    if id in pfp_cache_by_manu_id:
        # pfp_cache_by_manu_id[id] gives the list of id's of pictures for that manufacturer
        #   so pfp_cache_by_manu_id[id][0] is the ID of the first picture for that manufacturer
        return send_svg(pfp_cache_by_id[pfp_cache_by_manu_id[id][0]])
    
    return send_svg(DEFAULT_MANU_SVG)
    