from flask import Blueprint, request, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from user import User
import db_queries

blueprint_users_basic = Blueprint("blueprint_users_basic", __name__)

@blueprint_users_basic.route('/login', methods=['POST'])
def login():
    # TODO MAKE SURE THIS WORKS WITH login_manager.login_view = 'blueprint_users_basic.login'
    auth = db_queries.verify_credentials(request.form['email'], request.form['password'])
    if auth[1] == 202:
        login_user(User(auth[2]))
    return auth[0], auth[1]

@blueprint_users_basic.route('/register', methods=['POST'])
def register():
    # TODO FIX THIS FUNCTION THAT CURRENTLY DOES NO ERROR CHECKING
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
    logout_user()
    return redirect(url_for('index'))

@blueprint_users_basic.route('/garage')
@login_required
def garage():
    return jsonify(
        {
            "displayname": "displayname",
            "followers": 100,
            "following": 200,
            "catches": 25
        }
    ), 200


@blueprint_users_basic.route('/test4')
@login_required
def test4():
    return "<h3>COOKIES WORKING " + current_user.id + "</h3>"
