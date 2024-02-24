from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, user_id):
        # flask_login expects self.id to be a string. it's converted automatically from the database
        self.id = user_id
    
    def is_anonymous(self):
        return False
    def is_authenticated(self):
        return True
    
    def get_int_id(self):
        # occasionally useful
        return int(self.id)
    