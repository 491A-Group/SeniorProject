import psycopg

base_dir = input("base dir with all slashes:").strip()
files = input("space separated names. dont include svg extension:").strip()

all_routes = [base_dir+file+".svg" for file in files.split()]
for i in all_routes:
    print(i)

conn_str = input("connection string:")


with psycopg.connect(conn_str) as conn:
    with conn.cursor() as cur:
        for index, route in enumerate(all_routes):
            with open(route, 'rb') as file:
                cur.execute(
                    """
                    INSERT INTO profile_pictures(img, notes)
                    VALUES (%s, %s)
                    """,
                    (file.read(), files.split()[index] + ".svg")
                )
        
        conn.commit()
