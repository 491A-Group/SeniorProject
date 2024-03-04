"""
Brian wrote this unless portions are denoted otherwise
"""
from psycopg_pool import ConnectionPool
import configparser


# BRIAN: Argon2 One Way Hashing for securing passwords
# ph = PasswordHasher()

# BRIAN: Simply ready config.ini easily. Primarily used for db_config -> SimpleConnectionPool
config = configparser.ConfigParser()
config.read('config.ini')

# BRIAN: Connect to the PostgreSQL database
db_config = {
    # BRIAN: This dictionary gets details ready for psycopg SimpleConnectionPool using secrets from config.ini
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
db_connection_pool = ConnectionPool(
    min_size=int(config['pool']['min']),
    max_size=int(config['pool']['max']),
    kwargs= db_config
)

# def verify_credentials(email, raw_password):
#     """ BRIAN
#     Returns (Reason, HttpResponseCode)

#     Login a user given the strings from the form: 
#         - Email
#         - Raw password
    
#     This function
#         1. gets a psycopg connection
#         2. sql SELECT statement
#         3. argon2 verify password hash from SQL return
#         4. determines http code to return
#     """

#     with db_connection_pool.connection() as conn:
#         cursor = conn.execute(
#             """
#             SELECT id, password
#             FROM users
#             WHERE email = %s;
#             """,
#             (email,)
#         )
#         # BRIAN: fetchone() should return (id, hashed_password)
#         query_result = cursor.fetchone()
#         if query_result is not None:
#             id, hash = query_result
#             # print("debug555", id, hash, raw_password, type(hash), type(raw_password))
#             try:
#                 # BRIAN: ph.verify is the argon2 function
#                 # unfortunately, it does NOT return a boolean, but just throws an exception
#                 ph.verify(hash, raw_password)
#                 print("\nuser " + str(id) + " successfully logged in\n")
#                 return "Log In Success", 202, id
#             except Exception as e:
#                 return "Log In Rejected", 401
#     return "Server error", 500

# def register_credentials(email, displayname, raw_password):
#     """
#     Register a user. Returns (Reason, HttpResponseCode)
#     AS OF NOW THIS FUNCTION DOES NOT CHECK FOR VALID INPUTS
#         NOR
#     GRACEFULLY FAIL IF IT VIOLATES SQL RULES

#     # TODO FIX EXCEPTIONS IE DUPLICATE EMAIL, DUPLICATE DISPLAYNAME
#     """
#     with db_connection_pool.connection() as conn:
#         cursor = conn.execute(
#             """
#             INSERT INTO users (email, displayname, password)
#             VALUES (%s, %s, %s)
#             RETURNING id;
#             """,
#             (
#                 email,
#                 displayname,
#                 ph.hash(raw_password)
#             )
#         )
#         # Since the query says 'returning id;' this fetchone() returns a tuple that represents a row.
#         # BRIAN: This row has exactly one column that is the id
#         query_result = cursor.fetchone()
#         # print("SIGNUP QUERY RESULT: ", query_result)
#         if query_result is not None:
#             conn.commit()
#             return 'Registration Success', 201, query_result[0]
#         return 'Registration Failed', 409
#     return 'Server Error', 500

# def garage_overview(target_user, current_user):
#     """ BRIAN
#     Given a (target user's ID or displayname, current_user's ID) returns counts:
#         (displayname, followers, following, follow_status)
#         Follow status is 1 of 'self', 'following', 'stranger', ''
#     OR if ID isn't found:
#         ("", -2, -2, "self")
#     """
#     with db_connection_pool.connection() as conn:
#         cursor = conn.execute(
#             """
#             SELECT
#                 cache.target_displayname,
#                 (SELECT COUNT(*) as followers FROM follows JOIN users ON users.id=follows.followed WHERE users.id=cache.target_id),
#                 (SELECT COUNT(*) as following FROM follows JOIN users ON users.id=follows.follower WHERE users.id=cache.target_id),
#                 (
#                     SELECT
#                         CASE
#                             WHEN cache.target_id = cache.current_id THEN 'self'
#                             WHEN (SELECT COUNT(*)=1 FROM follows WHERE follower = cache.current_id AND followed = cache.target_id) THEN 'following'
#                             ELSE 'stranger'
#                         END as follow_status
#                 )
#             FROM
#                 (
#                     SELECT 
#                         id as target_id,
#                         displayname as target_displayname,
#                         (SELECT %s) as current_id
#                     FROM users """ +
#                     ("WHERE id = " if type(target_user) is int else "WHERE displayname = ") + """ %s
#                 ) AS cache
#             """,
#             (current_user, target_user,)
#         )
#         # fetchone() should be a tuple: (displayname, followers, following)
#         query_result = cursor.fetchone()
#         #   print(query_result)
#         if query_result is not None:
#             return query_result
#     return "", -2, -2, ""
    
# def search_username(query):
#     """
#     BRIAN: return a list of usernames that exist in the database given a search term
#     """
#     with db_connection_pool.connection() as conn:
#         cursor = conn.execute(
#             """
#             SELECT displayname
#             FROM users
#             WHERE displayname ILIKE %s LIMIT 20;
#             """,
#             (query + '%',)
#         )

#         # Since the query says 'displayname' this fetchall() returns a list of tuples that each represent a row.
#         #  Each row has exactly one column that is the displayname
#         #  Convert this simply to a list of displaynames with flat_list
#         query_result = cursor.fetchall()
#         if query_result is not None:
#             flat_list = [row[0] for row in query_result]
#             print("query result for '" + query + "':", flat_list)
#             return flat_list
#         print("DB_QUERIES.SEARCH_USERNAME ERROR. QUERY:", query, "QUERY_RESULT:", query_result)
#         return []
#     print(datetime.now(), "search_username error. query:", query)
#     return []
