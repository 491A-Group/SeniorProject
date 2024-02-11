## File Structure
 - As of 11/07/23:
   - /frontend is the entire npm project
   - /ACURA has the folder for the only model 
   - main.py and model.py are for the server

## Routes
?? index, login, signup

## Backend
 - flask server for ml. takes a request and returns predictions  
 - Request should be to :3000/predict with data in the body that's bytes of image
 

## Running
I always recommend to do a venv
 - A certain version of python may be required for tensorflow ?? tbd
 - `python -m venv venvname`
 - Activating venv:
   - Linux: `source venvname/bin/activate`
   - Windows: `venvname/Scripts/activate`
 - Install required libraries with pip
   - untested, however try `pip install -r requirements.txt`
   - otherwise try old fashioned way with 'pip install tensorflow numpy flask gunicorn pillow flask-cors flask-login argon2-cffi'
     - ..etc you'll see the next missing library each time it fails to run
 - Make a valid config file or get one from Brian ~ config.ini (need to do ssh tunnel in python first)
 - Make sure the frontend React project is built.
   - Navigate to 'frontend'
   - If it's the first time you need to run `npm install`
   - After making any changes make sure to compile them with `npm run build` otherwise Flask will serve your older build
 
## Finally, pick a way to serve:
### Gunicorn
 - only ?necessary? for deployment
 - have gunicorn installed 'pip install gunicorn'
 - gunicorn --workers 2 --bind 0.0.0.0:3030 main:app
   - i've copied the gunicorn command into run.sh
### Flask development server
 1. Activate the venv
 2. `python main.py`
### npm development server
 1. Navigate to 'frontend'
 2. `npm run`
