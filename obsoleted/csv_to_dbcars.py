import psycopg2
import csv

file_path = input("path to csv:")

with open(file_path, 'r') as file:
    conn_str = input("connection string:")
    
    reader = csv.reader(file)

    conn = psycopg2.connect(conn_str)
    
    with conn.cursor() as cur:

        cur.execute("SELECT * FROM manufacturers")
        man_list = cur.fetchall()
        
        manufacturers = {}
        for row in man_list:
            manufacturers[row[1]] = row[0]
        print(manufacturers)


        for row in reader:
            for index, element in enumerate(row):
                row[index] = element.strip()
            row[1] = manufacturers[row[1]]
            row[3] = int(row[3])
            row[4] = int(row[4])
            
            print('[', end='')
            for i in row:
                print(i, end=', ')
            print(']')
            
            cur.execute("INSERT INTO cars (label, make, model_name, start_year, end_year, description) VALUES (%s, %s, %s, %s, %s, %s);", tuple(row))
        
        conn.commit()
        cur.close()
        conn.close()
