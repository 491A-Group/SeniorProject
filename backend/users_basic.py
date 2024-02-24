"""
Brian wrote this unless portions are denoted otherwise

This file is for API endpoints - BACKEND
"""
from flask import Blueprint, request, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from backend.user import User
from . import db_queries

blueprint_users_basic = Blueprint("blueprint_users_basic", __name__)

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


@blueprint_users_basic.route('/logout')
@login_required
def logout():
    """ BRIAN:
    logout_user() interfaces with flask_login
    TODO fix return redirect to work with fetch api
    """
    logout_user()
    return redirect(url_for('index'))

@blueprint_users_basic.route('/garage')
@login_required
def garage():
    """ BRIAN:
    Basic fields for a user viewing their own profile
    """
    displayname, following, followers = db_queries.follows(current_user.get_int_id())
    return jsonify(
        {
            "displayname": displayname,
            "followers": followers,
            "following": following,
            "catches": 25
        }
    ), 200


@blueprint_users_basic.route('/test4')
@login_required
def test4():
    """BRIAN:
    This endpoint can safely be deleted. It is occasionally useful to determine if cookies are useful. 
    """
    return "<h3>COOKIES WORKING " + current_user.id + "</h3>"


@blueprint_users_basic.route('/search_users/<query>')
def search(query):
    return jsonify(db_queries.search_username(query))
