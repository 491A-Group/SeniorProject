"""
BRIAN MADE THIS FILE

add or remove followers. 
MVC: model and control logic are both in this file
"""

from flask import jsonify
from flask_login import login_required, current_user

from backend.db_queries import db_connection_pool
from backend.users_basic import blueprint_users_basic
    
@blueprint_users_basic.route('/user_function/follow/<displayname>', methods=['POST'])
@login_required
def follow(displayname):
    if len(displayname) > 32:
        return 'Bad request', 400

    connection = db_connection_pool.getconn()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """INSERT INTO follows(follower, followed) VALUES(
                    %s,
                    (SELECT id FROM users WHERE displayname=%s)
                );""",
                (current_user.get_int_id(), displayname)
            )
            connection.commit()
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)

    return 'followed', 201


@blueprint_users_basic.route('/user_function/unfollow/<displayname>', methods=['POST'])
@login_required
def unfollow(displayname):
    if len(displayname) > 32:
        return 'you followed', 400
    
    connection = db_connection_pool.getconn()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """DELETE FROM follows
                WHERE follower=%s 
                    AND followed=(
                        SELECT id FROM users
                        WHERE displayname=%s
                    )
                ;""",
                (current_user.get_int_id(), displayname)
            )
            connection.commit()
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)

    return 'no longer following', 201
