# CarModelServer
 - flask server for ml. takes a request and returns predictions  
 - request should be to :3030/predict with data in the body that's bytes of image
 
## file structure
 - as of 11/07/23: the model folder is /ACURA  
 - main.py and model.py are for the server
 - any client can run make_request to get predictions from running servers

## running
 recommended to do a venv
 - python -m venv venvname
 - source venvname/bin/activate
 - install required libraries with pip
   - untested, however try 'pip install -r requirements.txt'
   - otherwise try old fashioned way with 'pip install tensorflow numpy flask gunicorn pillow flask-cors flask-login argon2-cffi'
   -    ..etc you'll see the next missing library each time it fails to run
 - make a valid config file or get one from brian ~ config.ini (need to do ssh tunnel in python first)
 
 to serve:
 - have gunicorn installed 'pip install gunicorn'
 - gunicorn --workers 2 --bind 0.0.0.0:3030 main:app
   - i've copied the gunicorn command into run.sh
