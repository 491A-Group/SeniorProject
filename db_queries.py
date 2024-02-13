from psycopg2.pool import SimpleConnectionPool
import configparser
from argon2 import PasswordHasher

ph = PasswordHasher()

config = configparser.ConfigParser()
config.read('config.ini')

# Connect to the PostgreSQL database
db_config = {
    "dbname" :    config['postgres']['database'],
    "user" :      config['postgres']['user'],
    "password" :  config['postgres']['password'],
    "host" :      config['postgres']['host'],
    "port" :      config['postgres']['port'],
}

db_connection_pool = SimpleConnectionPool(
   minconn=1,
   maxconn=10,
   **db_config
)


def verify_credentials(email, raw_password):
    connection = db_connection_pool.getconn()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""  SELECT id, password
                                FROM users
                                WHERE email = %s;"""
                           , (email,))
            
            query_result = cursor.fetchone()
            if query_result is not None:
                id, hash = query_result
                print("debug555", id, hash, raw_password, type(hash), type(raw_password))
                try:
                    ph.verify(hash, raw_password)
                    print("\nuser " + str(id) + " successfully logged in\n")
                    return "Log In Success", 202, id
                except Exception as e:
                    print("\nfailed\n", e)
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)

    return "Log In Rejected", 401

def register_credentials(email, displayname, raw_password):
    # TODO FIX EXCEPTIONS IE DUPLICATE EMAIL, DUPLICATE DISPLAYNAME
    connection = db_connection_pool.getconn()
    try:
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
            #    This row has exactly one column that is the id
            query_result = cursor.fetchone()
            #print("SIGNUP QUERY RESULT: ", query_result)
            if query_result is not None:
                connection.commit()
                return 'Registration Success', 201, query_result[0]
            return 'Registration Failed', 409
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)