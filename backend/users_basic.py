"""
Brian wrote this unless portions are denoted otherwise

This file is for API endpoints - BACKEND
"""
from flask import Blueprint, request, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from backend.user import User
from . import db_queries
from backend.db_queries import db_connection_pool

blueprint_users_basic = Blueprint("blueprint_users_basic", __name__)
import backend.follow # make sure to import this AFTER the blueprint is made to avoid circular import

@blueprint_users_basic.route('/login', methods=['POST'])
def login():
    """ BRIAN
    Takes in a form and responds so React can act accordingly
    # TODO MAKE SURE THIS WORKS WITH login_manager.login_view = 'blueprint_users_basic.login'
    """
    auth = db_queries.verify_credentials(request.form['email'], request.form['password'])
    if auth[1] == 202:
        login_user(User(auth[2]))
    return auth[0], auth[1]

@blueprint_users_basic.route('/register', methods=['POST'])
def register():
    """ BRIAN
    Takes in a form and responds so React can act accordingly
    TODO FIX THIS FUNCTION THAT CURRENTLY DOES NO ERROR CHECKING
    """
    displayname = request.form["displayname"]
    email = request.form["email"]
    password = request.form["password"]
    
    #print(email, displayname, password)
    result = db_queries.register_credentials(email, displayname, password)

    if result[1] == 201:
        login_user(User(result[2]))

    return result[0], result[1]


# TODO declare rest methods
@blueprint_users_basic.route('/logout')
@login_required
def logout():
    """ BRIAN:
    logout_user() interfaces with flask_login
    TODO fix return redirect to work with fetch api
    """
    logout_user()
    return redirect(url_for('index'))

@blueprint_users_basic.route('/garage/<displayname>', methods=['GET'])
@login_required
def garage(displayname):
    """ BRIAN:
    Public fields when viewing a profile.
    Expects a string to search by displayname, however this
        function (not route) can also take an integer to search by id.
        displayname passed in from the flask route is always a string,
        however the other garage route calls this function passing in an id integer
    """
    # Debug
    #print(displayname, True if type(displayname) is int else False)
    displayname, followers, following, follow_status = db_queries.garage_overview(displayname, current_user.get_int_id())
    return jsonify(
        {
            "displayname": displayname,
            "followers": followers,
            "following": following,
            "catches": 25,
            "follow_status": follow_status
        }
    ), 200

@blueprint_users_basic.route('/garage', methods=['GET'])
@login_required
def current_garage():
    """ BRIAN:
    Simply the garage of the user currently logged in
    """
    return garage(current_user.get_int_id())

@blueprint_users_basic.route('/search_users/<query>', methods=['GET'])
def search(query):
    return jsonify(db_queries.search_username(query))


# SUGGESTIONS AND BUG REPORTING
@blueprint_users_basic.route('/brs', methods=['POST'])
@login_required
def suggest_or_report_bug():
    """ BRIAN:
    Simple sql to post a bug report. TODO check date/time of last sent to stop spam. 
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