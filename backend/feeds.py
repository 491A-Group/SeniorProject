from flask import request, session, jsonify
from flask_login import current_user, login_required
from backend.db_queries import db_connection_pool

import base64

from backend.user_post_flow import blueprint_user_post_flow

CHUNK_SIZE = 5 # CONST. originally 5, can increase/decrease to load more pictures at once. currently, a small pool of posts doesn't warrant a larger CHUNK_SIZE

@blueprint_user_post_flow.route('/feed', methods=['GET'])
@blueprint_user_post_flow.route('/garage_feed', methods=['GET'])
@blueprint_user_post_flow.route('/garage_feed/<user>', methods=['GET'])
@login_required
def feed(user=None):
    """BRIAN
    This function queries the database for posts. 
    
    Uses session to keep track of already-seen posts. 

    FOR THE GARAGE_FEED ENDPOINTS
        header Type is MAKE or LIST
            -list is more similar to the home feed
            -if Type=MAKE but there is no Make header provided then it's the list of makes and their quantities
            -if Type=MAKE AND Make=BMW then show list but only filtering BMW's
    """
    # Throw away malicious requests
    if user is not None and len(user) > 32:
        return 'Valid displayname provided?', 400
    
    # Determine what to do if we're looking at home feed vs a garage page
    home_or_garage = "garage" if request.url_rule.rule.startswith("/garage_feed") else "home"
    
    make_filter = "" # falsy
    user_selector_sql = ""

    known_session = session.get('last_feed')
    print('known session:', known_session)
    if home_or_garage == "home":
        known_feed = []
        if known_session[0] == 'home':
            known_feed = known_session[1]
        print('home feed:', known_feed)
    elif home_or_garage == "garage":
        # headers are used in the garage endpoint
        headers = request.headers

        user_selector_sql += " u.id = %s " if user is None else " u.displayname = %s "
        if user is None:
            user = current_user.get_int_id()

        # This first chunk is for garage_feed Type=MAKE but no Make header so no feed 
        if (headers['Type'] == 'MAKE') and ('Make' not in headers): 
            # The case of displaying Brand Tiles when Type=Manufacturer but no Specified Manufacturer is over.
            #   The reason that one is the odd-one out is because it doesn't serve a feed.
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
                    WHERE """ + user_selector_sql + """
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
        # above this line is the case we're viewing a list of manufacturers on a garage page
        else:
        # so below we set up garage feeds
            user_selector_sql = " AND" + user_selector_sql

        # The only difference between a Make=id feed and generic list feed is the one line of SQL 'WHERE make=%s'
        # Make filter embedded inside every select statement
        if "Make" in headers:
            make_filter = " AND m.id=%s " 
        
        if known_session[0] == 'garage': # Recall: we know we are about to visit a garage. Now determine if we already have a session in this same garage
            # last visited was garage
            _, known_feed, last_user, last_make = known_session
            
            if( (user != last_user) or
                ("Make" in headers and last_make != headers["Make"]) or
                ("Make" not in headers and last_make != None)
            ):
                known_feed = []
                print('feed change detected')
        else:
            # last visited feed was home
            known_feed = []
            print('home to garage change detected')
            

    # above this line was the setup 'if statement'


    # This select statement starts every possible statement in this file
    sql_select = """
    SELECT 
        post.id,
        u.displayname,
        u.profile_picture_id,
        pic.img_bin,
        m.name,
        m.id,
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
        post.likes,
        CASE
            WHEN EXISTS (SELECT 1 FROM likes WHERE post_id = post.id AND user_id = %s) THEN TRUE
            ELSE FALSE
        END AS liked
    FROM posts post
    JOIN users u ON u.id=post.user_id
    JOIN pictures pic ON pic.id=post.picture_id
    JOIN cars c ON c.id=post.car_id
    JOIN manufacturers m ON m.id=c.make
    WHERE post.id != ALL(%s)
    """ + make_filter + user_selector_sql + f"""
    ORDER BY datetime DESC
    LIMIT {CHUNK_SIZE};
    """

    # parameters like prepared statements that fit the '%s' placeholders
    # these could be made on the fly in the execute statement however in this complicated case this may look cleaner
    sql_parameters = [
        current_user.get_int_id(),  # SELECT liked case 
        known_feed,                 # WHERE pod.id != ALL(%s)
        headers["Make"] if make_filter else None,
        user if user_selector_sql else None,
    ]

    # if "Make" in headers:
    #     sql_parameters.append(headers["Make"])

    with db_connection_pool.connection() as conn:
        print(sql_parameters)
        cursor = conn.execute(
            sql_select,
            tuple(item for item in sql_parameters if item is not None)
        )
        query_results = cursor.fetchall()
        known_feed.extend([result[0] for result in query_results])
        
        if home_or_garage == "home":
            session['last_feed'] = ('home', known_feed)
        elif home_or_garage == "garage":
            session['last_feed'] = ('garage', known_feed, user, headers['Make'] if 'Make' in headers else None)

        # dank list comprehension where every element is a dictionary from comprehension but those are actually made from elements from a 
        #       list comprehension because the original list of tuples included post.id which is private info.
        posts_to_serve = [
            {
                "poster_displayname": displayname,
                "poster_pfp": pfp_id,
                "post_image": base64.b64encode(img_bin).decode('utf-8'),
                "car_model": model,
                "car_make": make,
                "car_make_id": make_id,
                "car_details": description,
                "car_start_year": start_year,
                "car_end_year": end_year,
                "post_uuid": uuid,
                "post_timestamp": timestamp.isoformat(),
                "post_likes": likes,
                "post_location": [state, county, place],
                "post_liked_by_current_user": liked,
            } for displayname, pfp_id, img_bin, 
                    make, make_id, model, start_year, end_year, description,
                    uuid, timestamp, state, county, place, likes, liked in [result[1:] for result in query_results]
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
