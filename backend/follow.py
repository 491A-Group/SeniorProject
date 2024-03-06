"""
BRIAN MADE THIS FILE

follow or unfollow users. see followers/following

MVC: model and control logic are both in this file
The first check in each function quickly disregards requests that are attempting to
reference a displayname longer than Postgres schema allowed
"""

from flask_login import login_required, current_user
from flask import jsonify

from backend.db_queries import db_connection_pool
from backend.users_basic import blueprint_users_basic
    
@blueprint_users_basic.route('/user_function/follow/<displayname>', methods=['POST'])
@login_required
def follow(displayname):
    """BRIAN:
    This function follows a user. 
    """
    if len(displayname) > 32:
        return 'Bad Request', 400
    with db_connection_pool.connection() as conn:
        conn.execute(
            """
            INSERT INTO follows(follower, followed) VALUES(
                %s,
                (SELECT id FROM users WHERE displayname=%s)
            );
            """,
            (current_user.get_int_id(), displayname)
        )
        conn.commit()
        return 'followed', 201
    return 'Server error', 500


@blueprint_users_basic.route('/user_function/unfollow/<displayname>', methods=['POST'])
@login_required
def unfollow(displayname):
    """BRIAN:
    This function unfollows a user. 
    """
    if len(displayname) > 32:
        return 'Bad Request', 400
    with db_connection_pool.connection() as conn:
        conn.execute(
            """
            DELETE FROM follows
            WHERE   follower=%s 
                    AND followed=(
                        SELECT id FROM users
                        WHERE displayname=%s
                    );
            """,
            (current_user.get_int_id(), displayname)
        )
        conn.commit()
        return 'no longer following', 201
    return 'Server error', 500


@blueprint_users_basic.route('/user_function/get_relations/<relation>', methods=['GET'])
@login_required
def get_list(relation):
    """BRIAN:
    This function returns a list of displaynames and id's
    It can show who you are following or who follows you
    """
    if len(relation) > 32:
        return 'Bad Request', 400
    if relation != 'followers' and relation != 'following':
        return 'Bad Request', 400
    
    find_followers_query = """
    SELECT u.profile_picture_id, u.displayname
    FROM users u
    JOIN follows f ON f.follower=u.id
    WHERE f.followed=%s
    """

    find_following_query = """
    SELECT u.profile_picture_id, u.displayname
    FROM users u
    JOIN follows f ON f.followed=u.id
    WHERE f.follower=%s
    """

    with db_connection_pool.connection() as conn:    
        if relation == 'followers':
            cur = conn.execute(find_followers_query, (current_user.get_int_id(),))
        elif relation == 'following':
            cur = conn.execute(find_following_query, (current_user.get_int_id(),))
        return jsonify(
            [{"displayname": displayname, "pfp_id": pfp_id} for pfp_id, displayname in cur.fetchall()]
        ), 200
    return 'Server error', 500
