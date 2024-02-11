from flask import Blueprint, request, redirect, url_for, Response
from flask_login import login_user, login_required, logout_user, current_user
from user import User
import db_queries

blueprint_users_basic = Blueprint("blueprint_users_basic", __name__)

@blueprint_users_basic.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        auth = db_queries.verify_credentials(request.form['email'], request.form['password'])
        if auth[0]:
            user = User(auth[1])
            login_user(user)
            return redirect(url_for('blueprint_users_basic.garage'))
        return Response("Invalid Credentials", status=401)
    
    #TODO replace get with 405 not allowed after frontend is all working?
    return """
    <form method="post">
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">Login</button>
    </form>
    """

@blueprint_users_basic.route('/register', methods=['GET', 'POST'])
def register():
    # TODO FIX THIS FUNCTION THAT CURRENTLY DOES NO ERROR CHECKING
    if request.method == 'POST':
        email = request.form["email"]
        displayname = request.form["displayname"]
        password = request.form["password"]
        
        print(email, displayname, password)

        db_queries.register_credentials(email, displayname, password)
        return "<p>test</p>"
    return """
    <form method="post">
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" required>
        <br>
        <label for="displayname">Displayname:</label>
        <input type="text" id="displayname" name="displayname" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <label for="password_conf">Confirm Password:</label>
        <input type="password" id="password_conf" name="password_conf" required>
        <br>
        <button type="submit">Register</button>
    </form>
    """


@blueprint_users_basic.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@blueprint_users_basic.route('/garage')
@login_required
def garage():
    return """

<h3>%s garage here</h3>
<button id="fetch_test4">test4</button>

<script>
    const destination = location.protocol + "//" + location.host + "/";
    document.getElementById('fetch_test4').addEventListener('click', function() {
    fetch(destination + "/test4")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            console.log('Fetch Text: ', text);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    });
</script>   

""" % (current_user.id)


@blueprint_users_basic.route('/test4')
@login_required
def test4():
    return "<h3>COOKIES WORKING " + current_user.id + "</h3>"
