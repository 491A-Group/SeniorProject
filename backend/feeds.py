from flask import request, session, jsonify
from flask_login import current_user, login_required
from backend.db_queries import db_connection_pool
#from backend.user import session_feeds
import base64

from backend.user_post_flow import blueprint_user_post_flow

CHUNK_SIZE = 5 # CONST. originally 5, can increase/decrease to load more pictures at once. currently, a small pool of posts doesn't warrant a larger CHUNK_SIZE
    #print("existing session feed", session_feeds[current_user.get_int_id()])

@blueprint_user_post_flow.route('/feed', methods=['GET'])
@login_required
def feed():
    """BRIAN
    This function queries the database for posts. It uses the current_user object to keep track
    of served posts so in one session no post is served twice. The current method is pretty slow,
    and might even be faster if we stored seen posts in postgres. A big reason for this is
    current_user is a proxy, however for now this performs alright. 
    """
    known_feed = session.get("home_feed")

    with db_connection_pool.connection() as conn:
        cursor = conn.execute(
            f"""
            SELECT 
                post.id,
                u.displayname,
                u.profile_picture_id,
                pic.img_bin,
                m.name,
                c.model_name,
                c.start_year,
                c.end_year,
                c.description,
                post.public_id,
                post.datetime,
                CASE
                    WHEN post.location IS NOT NULL THEN (SELECT name FROM postgis_us_states WHERE st_contains(geom, post.location) LIMIT 1)
                    ELSE NULL
                END AS state,
                CASE
                    WHEN post.location IS NOT NULL THEN (SELECT namelsad FROM postgis_us_counties WHERE st_contains(geom, post.location) LIMIT 1)
                    ELSE NULL
                END AS county,
                CASE
                    WHEN post.location IS NOT NULL THEN (SELECT name FROM postgis_places WHERE st_contains(geom, post.location) LIMIT 1)
                    ELSE NULL
                END AS place,
                post.likes
            FROM posts post
            JOIN users u ON u.id=post.user_id
            JOIN pictures pic ON pic.id=post.picture_id
            JOIN cars c ON c.id=post.car_id
            JOIN manufacturers m ON m.id=c.make
            WHERE post.id != ALL(%s)
            ORDER BY datetime DESC
            LIMIT {CHUNK_SIZE};
            """,
            #[session.get('home_feed')]
            #[session.get('home_feed')]
            [known_feed]
        )
        query_results = cursor.fetchall()
        #session_feeds[current_user.get_int_id()].extend([result[0] for result in query_results]) # add post id's to session_feed
        known_feed.extend([result[0] for result in query_results])
        session['home_feed'] = known_feed

        #print("this requests' ids:", [result[0] for result in query_results])
        #print("user session_feeds after update:", session_feeds[current_user.get_int_id()], "\n")
        
        # dank list comprehension where every element is a dictionary from comprehension but those are actually made from elements from a 
        #       list comprehension because the original list of tuples included post.id which is private info.
        posts_to_serve = [
            {
                "poster_displayname": displayname,
                "poster_pfp": pfp_id,
                "post_image": base64.b64encode(img_bin).decode('utf-8'),
                "car_model": model,
                "car_make": make,
                "car_details": description,
                "car_start_year": start_year,
                "car_end_year": end_year,
                "post_uuid": uuid,
                "post_timestamp": timestamp.isoformat(),
                "post_likes": likes,
                "post_location": [state, county, place],
            } for displayname, pfp_id, img_bin, 
                    make, model, start_year, end_year, description,
                    uuid, timestamp, state, county, place, likes in [result[1:] for result in query_results]
        ]
        # since conditionals in python list comprehension is tricky I drop null values here
        for post in posts_to_serve:
            if post["post_location"] == [None, None, None]:
                del post["post_location"]
        #print(posts_to_serve)

        # please indicate to users when there are no more posts to show, indicated with 206 response code.
        if len(query_results) < CHUNK_SIZE:
            return jsonify(posts_to_serve), 206
        return jsonify(posts_to_serve), 200
    return 'Server Error', 500


@blueprint_user_post_flow.route('/garage_feed', methods=['GET'])
@blueprint_user_post_flow.route('/garage_feed/<user>', methods=['GET'])
def user_feed(user=None):
    # Type is MAKE or LIST
    # list is more similar to the home feed
    # if type=make but there is no make provided then it's the list of makes and their quantities

    # basic user checks are done
    if user is not None and len(user) > 32:
        return 'Valid displayname provided?', 400
    if user is None:
        user = current_user.get_int_id()
    user_selector_sql = " WHERE u.id = %s " if type(user) is int else " WHERE u.displayname = %s "

    # logic for which type of request
    headers = request.headers
    if 'Type' not in headers or headers['Type'] not in ('MAKE', 'LIST'):
        return 'Missing/invalid header "Type"="MAKE"|"LIST"', 400
    elif headers['Type'] == 'MAKE' and 'Make' not in headers: 
        # Generic MAKEs page; showing icons of manufacturers. 
        # MAKE is the value for key 'Type' and Make is not a key in headers. 
        with db_connection_pool.connection() as conn:
            cursor = conn.execute(
                """
                SELECT m.id, m.name, COUNT(*)
                FROM users u
                JOIN posts p ON p.user_id = u.id
                JOIN cars c ON c.id = p.car_id
                JOIN manufacturers m ON m.id = c.make
                """ + user_selector_sql + """
                GROUP BY m.id
                ORDER BY COUNT(*) DESC
                """,
                (user,)
            )
            return jsonify([
                {
                    "id": manu_id,
                    "name": manu_name,
                    "count": count
                } for (manu_id, manu_name, count) in cursor.fetchall()
            ])
    else: # headers['type'] == 'LIST'
        return jsonify([]), 200
    return 'Server Error', 500
