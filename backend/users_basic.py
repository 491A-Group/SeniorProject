"""
Brian wrote this unless portions are denoted otherwise

'suggest_or_report_bug' and 'query' are for peer review 2

This file is for API endpoints - BACKEND
"""
from flask import Blueprint, request, session, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from backend.user import User
from backend.db_queries import db_connection_pool

import psycopg # for errors
from argon2 import PasswordHasher, exceptions
from datetime import datetime

blueprint_users_basic = Blueprint("blueprint_users_basic", __name__)
import backend.follow # make sure to import this AFTER the blueprint is made to avoid circular import

ph = PasswordHasher()

@blueprint_users_basic.route('/test_session', methods=['GET'])
@login_required
def test_session():
    return 'Session seems valid', 200

@blueprint_users_basic.route('/login', methods=['POST'])
def login():
    """ BRIAN
    Takes in a form and responds so React can act accordingly
    # TODO MAKE SURE THIS WORKS WITH login_manager.login_view = 'blueprint_users_basic.login'
    """
    email = request.form['email']
    raw_password = request.form['password']

    with db_connection_pool.connection() as conn:
        cursor = conn.execute(
            """
            SELECT id, password
            FROM users
            WHERE email = %s;
            """,
            (email,)
        )
        # BRIAN: fetchone() should return (id, hashed_password)
        query_result = cursor.fetchone()
        if query_result is None:
            # most likely caused by non-existent email
            return "Log In Rejected", 401
        if query_result is not None:
            id, hash = query_result
            # print("debug555", id, hash, raw_password, type(hash), type(raw_password))
            try:
                # BRIAN: ph.verify is the argon2 function
                # unfortunately, it does NOT return a boolean, but just throws an exception
                ph.verify(hash, raw_password)
                login_user(User(id))
                session[str(id) + '_last_feed'] = ('home', []) 
                    # above is the form for home feed session.
                    # otherwise is ('garage', [], last_user, last_make). make can even be None to indicate list view
                print("\nuser " + str(id) + " successfully logged in\n")
                return "Log In Success", 202
            except Exception as e:
                return "Log In Rejected", 401
    return "Server error", 500

@blueprint_users_basic.route('/register', methods=['POST'])
def register():
    """ BRIAN
    Takes in a form and responds so React can act accordingly
    """
    displayname = request.form["displayname"]
    email = request.form["email"]
    raw_password = request.form["password"]

    if not displayname:
        return 'displayname empty', 422
    if len(displayname) > 32:
        return 'displayname 32 character max', 422
    if not raw_password:
        return 'password empty', 422
    if len(email) < 5 or '@' not in email or '.' not in email or len(email) > 320:
        return 'email invalid', 422


    with db_connection_pool.connection() as conn:
        try:
            cursor = conn.execute(
                """
                INSERT INTO users (email, displayname, password)
                VALUES (%s, %s, %s)
                RETURNING id;
                """,
                (
                    email,
                    displayname,
                    ph.hash(raw_password)
                )
            )
            # Since the query says 'returning id;' this fetchone() returns a tuple that represents a row.
            # BRIAN: This row has exactly one column that is the id
            query_result = cursor.fetchone()
            #print("SIGNUP QUERY RESULT: ", query_result)
            if query_result is not None:
                conn.commit()
                login_user(User(query_result[0]))
                session[str(query_result[0]) + '_last_feed'] = ('home', [])
                return 'Registration Success', 201
            return 'Registration Failed', 409
        except psycopg.errors.UniqueViolation as e:
            #print('unique error!', e, '\n\n!!!!!!', e.__dict__)
            e = str(e).split('\n')[0] # get the first line of the error typically
            """
            duplicate key value violates unique constraint "users_email_pk"
            DETAIL:  Key (email)=(brian1@gmail.com) already exists.
            """
            #print('!!' + e + '!!')
            if e.endswith('"users_email_pk"'):
                print('returning 409, email in use:', email)
                return 'email exists', 409
            if e.endswith('"users_displayname_pk"'):
                print('returning 409, displayname in use:', displayname)
                return 'username taken', 409
        except Exception as e:
            print('Sign up error!')
            print(e)
    return 'Server Error', 500


@blueprint_users_basic.route('/logout')
@login_required
def logout():
    """ BRIAN:
    logout_user() interfaces with flask_login
    TODO fix return redirect to work with fetch api
    """
    logout_user()
    return redirect(url_for('index'))

@blueprint_users_basic.route('/garage', methods=['GET'])
@blueprint_users_basic.route('/garage/<displayname>', methods=['GET'])
@login_required
def garage(displayname=None):
    """ BRIAN:
    Public fields when viewing a profile.
    Expects a string to search by displayname, however this
        function (not route) can also take an integer to search by id.
        displayname passed in from the flask route is always a string,
        however the other garage route calls this function passing in an id integer

    Given a (target user's ID or displayname, current_user's ID) returns counts:
    (displayname, followers, following, follow_status, catches, pfp)
    Follow status is one of 'self', 'following', 'stranger', '', 1
    OR if ID isn't found:
    ("", -2, -2, "", -2)
    """
    # If a displayname is provided that's the target, otherwise target self
    target_user=current_user.get_int_id()
    if displayname:
        target_user = displayname

    # ERROR CASE to be overwritten later; otherwise this error is the default
    displayname = ''
    followers = -2
    following = -2
    follow_status = ''
    catches = -2
    pfp = 1
    
    with db_connection_pool.connection() as conn:
        cursor = conn.execute(
            """
            SELECT
                cache.target_displayname,
                (SELECT count(*) AS followers FROM follows JOIN users ON users.id=follows.followed WHERE users.id=cache.target_id),
                (SELECT count(*) AS following FROM follows JOIN users ON users.id=follows.follower WHERE users.id=cache.target_id),
                (
                    SELECT
                        CASE
                            WHEN cache.target_id = cache.current_id THEN 'self'
                            WHEN (SELECT COUNT(*)=1 FROM follows WHERE follower = cache.current_id AND followed = cache.target_id) THEN 'following'
                            ELSE 'stranger'
                        END as follow_status
                ),
                (
                    SELECT count(*)
                    FROM posts
                    WHERE user_id=cache.target_id
                ) AS catches,
                cache.pfp_id
            FROM
                (
                    SELECT 
                        id as target_id,
                        displayname as target_displayname,
                        (SELECT %s) as current_id,
                        profile_picture_id as pfp_id
                    FROM users """ +
                    ("WHERE id = " if type(target_user) is int else "WHERE displayname = ") + """ %s
                ) AS cache
            """,
            (current_user.get_int_id(), target_user,)
        )
        # fetchone() should be a tuple: (displayname, followers, following, follow_status, catches)
        query_result = cursor.fetchone()
        print(query_result)
        if query_result is not None:
            displayname, followers, following, follow_status, catches, pfp = query_result
    
    return jsonify(
        {
            "displayname": displayname,
            "followers": followers,
            "following": following,
            "follow_status": follow_status,
            "catches": catches,
            "pfp_id": pfp,
        }
    ), 200

@blueprint_users_basic.route('/search_users/<query>', methods=['GET'])
def search(query):
    """BRIAN:
    This function was added after the first work review.

    It serves a list of users to be fed into the frontend RenderUserList.js:
    [{displayname, pfp_id}, {displayname, pfp_id} ...]

    LIMIT 32 to not make too much load
    """
    with db_connection_pool.connection() as conn:
        cursor = conn.execute(
            """
            SELECT displayname, profile_picture_id
            FROM users
            WHERE displayname ILIKE %s
            LIMIT 32;
            """,
            (query + '%',)
        )
        # Since the query says 'displayname' this fetchall() returns a list of tuples that each represent a row.
        #  Each row has exactly one column that is the displayname
        #  Convert this simply to a list of displaynames with flat_list
        query_result = cursor.fetchall()
        if query_result is not None:
            flat_list = [{"displayname": row[0], "pfp_id": row[1]} for row in query_result]
            print("query result for '" + query + "':", flat_list)
            return jsonify(flat_list)
        print("DB_QUERIES.SEARCH_USERNAME ERROR. QUERY:", query, "QUERY_RESULT:", query_result)
        return jsonify([]), 200
    print(datetime.now(), "search_username error. query:", query)
    return 'Server Error', 500


# SUGGESTIONS AND BUG REPORTING
@blueprint_users_basic.route('/brs', methods=['POST'])
@login_required
def suggest_or_report_bug():
    """ BRIAN:
    Simple sql to post a bug report. TODO check date/time of last sent to stop spam. 

    This backend endpoint is almost done for Peer Review 2 however it's not available on the frontend yet. 
    """
    message = request.json.get('message')
    if len(message) > 2048:
        return '2048 Characters Max', 413 # Content too large

    with db_connection_pool.connection() as conn:
        conn.execute(
            """
            INSERT INTO suggestions(user_id, suggestion)
            VALUES (%s, %s);
            """,
            (current_user.get_int_id(), message)
        )
        return 'Success', 200
    return 'Server error', 500


"""
SETTINGS PORTION
Brian did this in the final sprint
"""
@blueprint_users_basic.route('/settings/displayname', methods=['POST'])
@login_required
def change_displayname():
    r = request.json
    if 'displayname' not in r:
        return 'missing displayname in json body', 422
    if 'password' not in r:
        return 'missing password in json body', 422
    displayname = r['displayname']
    raw_pass = r['password']
    if not displayname:
        return 'displayname empty', 422
    if len(displayname) > 32:
        return 'displayname 32 character max', 422

    with db_connection_pool.connection() as conn:
        cursor = conn.execute(
            """
            SELECT password
            FROM users
            WHERE id=%s;
            """,
            (current_user.get_int_id(),)
        )
        hash_pass = cursor.fetchone()[0]
        
        try:
            ph.verify(hash_pass, raw_pass)
        except exceptions.VerifyMismatchError as e:
            return "Password Incorrect", 401
        except Exception as e:
            print('change_displayname password hasher error', e, type(e))
            return 'Server error', 500

        # auth passed; continue to update username
        try:
            cursor = conn.execute(
                """
                UPDATE users
                SET displayname=%s
                WHERE id=%s;
                """,
                (
                    displayname,
                    current_user.get_int_id()
                )
            )
            return 'displayname changed', 200
        except psycopg.errors.UniqueViolation as e:
            return 'taken already', 409
        except Exception as e:
            print('change displayname UPDATE statement error!', displayname)
            return 'Server error', 500
            
    return 'Server error', 500


@blueprint_users_basic.route('/settings/password', methods=['POST'])
@login_required
def change_password():
    r = request.json
    if 'new_password' not in r:
        return 'missing new_password in json body', 422
    if 'old_password' not in r:
        return 'missing old_password in json body', 422
    new_password = r['new_password']
    old_password = r['old_password']
    if not new_password:
        return 'new password seems empty?', 422

    with db_connection_pool.connection() as conn:
        cursor = conn.execute(
            """
            SELECT password
            FROM users
            WHERE id=%s;
            """,
            (current_user.get_int_id(),)
        )
        hash_pass = cursor.fetchone()[0]
        
        try:
            ph.verify(hash_pass, old_password)
        except exceptions.VerifyMismatchError as e:
            return "Password Incorrect", 401
        except Exception as e:
            print('change_password password hasher error', e, type(e))
            return 'Server error', 500

        # auth passed; continue to update password
        try:
            cursor = conn.execute(
                """
                UPDATE users
                SET password=%s
                WHERE id=%s;
                """,
                (
                    ph.hash(new_password),
                    current_user.get_int_id()
                )
            )
            return 'password changed', 200
        except Exception as e:
            print('change password error!')
            return 'Server error', 500
    return 'Server error', 500