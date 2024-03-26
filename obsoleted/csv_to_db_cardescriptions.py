import psycopg

file_path = input("path to csv:")

with open(file_path, 'r') as file:
    conn_str = input("connection string:")
    
    conn = psycopg.connect(conn_str)
    
    with conn.cursor() as cur:

        for line in file:
            label, description = line.split(',', 1)
            description = description.strip() # remove whitespaces/newlines
            description = description.strip('"') # remove quotes
            print("label:!" + label + "!\ndescription:" + description + "!")
            cur.execute(
                "UPDATE cars SET description=%s WHERE label ILIKE %s;",
                (description, label)
            )
        
        conn.commit()
