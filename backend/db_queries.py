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
