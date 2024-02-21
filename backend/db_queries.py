"""
Brian wrote this unless portions are denoted otherwise
"""
from psycopg2.pool import SimpleConnectionPool
import configparser
from argon2 import PasswordHasher

# BRIAN: Argon2 One Way Hashing for securing passwords
ph = PasswordHasher()

# BRIAN: Simply ready config.ini easily. Primarily used for db_config -> SimpleConnectionPool
config = configparser.ConfigParser()
config.read('config.ini')

# BRIAN: Connect to the PostgreSQL database
db_config = {
    # BRIAN: This dictionary gets details ready for psycopg2 SimpleConnectionPool using secrets from config.ini
    "dbname" :    config['postgres']['database'],
    "user" :      config['postgres']['user'],
    "password" :  config['postgres']['password'],
    "host" :      config['postgres']['host'],
    "port" :      config['postgres']['port'],
}

""" BRIAN
Get connection from this connection pool.
Opening new connections can be expensive so this keeps some idle without closing them. 
"""
db_connection_pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    **db_config
)

def verify_credentials(email, raw_password):
    """ BRIAN
    Returns (Reason, HttpResponseCode)

    Login a user given the strings from the form: 
        - Email
        - Raw password
    
    This function
        1. gets a psycopg2 connection
        2. sql SELECT statement
        3. argon2 verify password hash from SQL return
        4. determines http code to return
    """
    with db_connection_pool.getconn() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""  SELECT id, password
                                FROM users
                                WHERE email = %s;"""
                           , (email,))
            # BRIAN: fetchone() should return (id, hashed_password)
            query_result = cursor.fetchone()
            if query_result is not None:
                id, hash = query_result
                # print("debug555", id, hash, raw_password, type(hash), type(raw_password))
                try:
                    # BRIAN: ph.verify is the argon2 function
                    # unfortunately, it does NOT return a boolean, but just throws an exception
                    ph.verify(hash, raw_password)
                    print("\nuser " + str(id) + " successfully logged in\n")
                    return "Log In Success", 202, id
                except Exception as e:
                    print("\nfailed\n", e)

    return "Log In Rejected", 401

def register_credentials(email, displayname, raw_password):
    """
    Register a user. Returns (Reason, HttpResponseCode)
    AS OF NOW THIS FUNCTION DOES NOT CHECK FOR VALID INPUTS
        NOR
    GRACEFULLY FAIL IF IT VIOLATES SQL RULES

    # TODO FIX EXCEPTIONS IE DUPLICATE EMAIL, DUPLICATE DISPLAYNAME
    """
    with db_connection_pool.getconn() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""  INSERT INTO users (email, displayname, password)
                                VALUES (%s, %s, %s)
                                RETURNING id;"""
                           , (
                               email,
                               displayname,
                               ph.hash(raw_password)
                               )
            )
            # Since the query says 'returning id;' this fetchone() returns a tuple that represents a row.
            # BRIAN: This row has exactly one column that is the id
            query_result = cursor.fetchone()
            # print("SIGNUP QUERY RESULT: ", query_result)
            if query_result is not None:
                connection.commit()
                return 'Registration Success', 201, query_result[0]
            return 'Registration Failed', 409


def follows(user_id):
    """ BRIAN
    Given a user's ID returns counts:
        (following, followers)
    OR if ID isn't found:
        (-2, -2)
    """
    with db_connection_pool.getconn() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""  SELECT
                                    (SELECT COUNT(*) FROM follows WHERE follower = %s),
                                    (SELECT COUNT(*) FROM follows WHERE followed = %s)"""
                , (user_id, user_id)
            )
            # Since the query says 'returning id;' this fetchone() returns a tuple that represents a row.
            #    This row has exactly one column that is the id
            query_result = cursor.fetchone()
            print(query_result)
            if query_result is not None:
                return query_result
            return -2, -2