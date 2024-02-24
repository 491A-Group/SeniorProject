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
    minconn=2,
    maxconn=50,
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

    connection = db_connection_pool.getconn()
    try:
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
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)

    return "Log In Rejected", 401

def register_credentials(email, displayname, raw_password):
    """
    Register a user. Returns (Reason, HttpResponseCode)
    AS OF NOW THIS FUNCTION DOES NOT CHECK FOR VALID INPUTS
        NOR
    GRACEFULLY FAIL IF IT VIOLATES SQL RULES

    # TODO FIX EXCEPTIONS IE DUPLICATE EMAIL, DUPLICATE DISPLAYNAME
    """
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
            # BRIAN: This row has exactly one column that is the id
            query_result = cursor.fetchone()
            # print("SIGNUP QUERY RESULT: ", query_result)
            if query_result is not None:
                connection.commit()
                return 'Registration Success', 201, query_result[0]
            return 'Registration Failed', 409
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)

def follows(user):
    """ BRIAN
    Given a user's ID returns counts:
        (displayname, followers, following)
    OR if ID isn't found:
        ("", -2, -2)
    """
    connection = db_connection_pool.getconn()
    try:
        with connection.cursor() as cursor:
            print(type(user))
            cursor.execute("""
                SELECT
                    subquery.displayname,
                    (SELECT COUNT(*) as followers FROM follows JOIN users ON users.id=follows.followed WHERE users.id=subquery.id),
                    (SELECT COUNT(*) as following FROM follows JOIN users ON users.id=follows.follower WHERE users.id=subquery.id)
                FROM
                    (
                        SELECT id, displayname
                        FROM users """ +
                        ("WHERE id = " if type(user) is int else "WHERE displayname = ") + """ %s
                    ) AS subquery""",
                (user,)
            )

            # fetchone() should be a tuple: (displayname, followers, following)
            query_result = cursor.fetchone()
            print(query_result)
            if query_result is not None:
                return query_result
            return "", -2, -2
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)
    
def search_username(query):
    """
    BRIAN: return a list of usernames that exist in the database given a search term
    """
    connection = db_connection_pool.getconn()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """SELECT displayname FROM users WHERE displayname ILIKE %s LIMIT 20;""",
                (query + '%',)
            )

            # Since the query says 'displayname' this fetchall() returns a list of tuples that each represent a row.
            #  Each row has exactly one column that is the displayname
            #  Convert this simply to a list of displaynames with flat_list
            query_result = cursor.fetchall()
            if query_result is not None:
                flat_list = [row[0] for row in query_result]
                print("query result for '" + query + "':", flat_list)
                return flat_list
            print("DB_QUERIES.SEARCH_USERNAME ERROR. QUERY:", query, "QUERY_RESULT:", query_result)
            return []
    finally:
        print("returning a thread to the pool")
        db_connection_pool.putconn(connection)
