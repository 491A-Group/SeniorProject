from flask import Flask, render_template, jsonify
from flask_login import LoginManager
import configparser


config = configparser.ConfigParser()
config.read('config.ini')

app = Flask(
    __name__,
    static_url_path='',
    static_folder='frontend/build',
    template_folder='frontend/build'
)
app.config['SECRET_KEY'] = config["SECRET_KEY"]["key"]

# FOR INCREMENTAL DEVELOPMENT I TURN THIS OFF SINCE ITS SLOW ON STARTUP, UNCOMMENT TO DEPLOY
#from model import blueprint_model
#app.register_blueprint(blueprint_model)

login_manager = LoginManager(app)
login_manager.login_view = 'blueprint_users_basic.login'
from user import User
@login_manager.user_loader
def load_user(user_id):
    return User(user_id)
from users_basic import blueprint_users_basic
app.register_blueprint(blueprint_users_basic)

@app.route("/")
def index():
    # This is the main entry point for React. Other entry points in the project are for fetch/restful api
    return render_template("index.html")

@app.route('/api/home_1')
def home_1():
    print("asdf")
    example = [
        {
            "name": "1990-1999 Mitsubishi 3000GT",
            "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mitsubishi_motors_new_logo.svg/2000px-Mitsubishi_motors_new_logo.svg.png",
            "details": """The Mitsubishi 3000GT is a front-engine, all-wheel/front-wheel drive grand touring/sports car manufactured and marketed by Mitsubishi from 1990 until 2000 over three different generations. Manufactured in a three-door hatchback coupé body style in Nagoya, Japan, the 2+2 four-seaters were marketed in the Japanese domestic market (JDM) as the GTO, and globally as 3000GT. In North America, it was sold both as the Mitsubishi 3000GT (1991–1999) and the Dodge Stealth (1991–1996), a badge engineered, mechanically identical captive import. As a collaborative effort between Chrysler and Mitsubishi Motors, Chrysler was responsible for the Stealth's exterior styling."""
        },
        {
            "name": "1993-2004 Ford Mustang",
            "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/2560px-Ford_logo_flat.svg.png",
            "details": """In November 1993, the Mustang debuted its first major redesign in fifteen years. Code-named "SN95" by the automaker, it was based on an updated version of the rear-wheel drive Fox platform called "Fox-4." The new styling by Patrick Schiavone incorporated several styling cues from earlier Mustangs.[53] For the first time since its introduction 1964, a notchback coupe model was not available. The door windows on the coupe were once again frameless; however, the car had a fixed "B" pillar and rear windows"""
        },
        {
            "name": "1996-2001 Honda Prelude",
            "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/2560px-Honda.svg.png",
            "details": """Introduced on 7 November 1996, the fifth-generation Prelude retained an FF layout with an independent front suspension and 63/37 weight distribution. The fifth-generation Prelude marked a return to the more square bodystyle of the third generation (1987–1991), in an attempt to curb slumping sales of the fourth-generation bodystyle. A two-door notchback style is retained but the design is less aggressive and more angular than the previous generation. The redesigned sports coupe is slightly larger than its predecessor at 1.4 inches (36 mm) longer in wheelbase and 3.2 inches (81 mm) overall. Base curb weight increased by 145 pounds (66 kg) and interior dimensions are nearly identical but trunk space expanded by nearly 1 cubic foot."""
        }
    ]
    return jsonify(example)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3030)
print('main.py is finishing execution. see readme for gunicorn instructions instead')
