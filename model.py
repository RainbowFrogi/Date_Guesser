import mysql.connector

connection = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='guess_location',
    user='guess_location_player',
    password='g43S5_pa5sword',
    autocommit=True,
    collation='utf8mb4_general_ci'
)

def get_location(id: int):
    cursor = connection.cursor()
    cursor.execute(f"SELECT location_id, image_path FROM locations WHERE location_id = '{id}' LIMIT 1;")
    row = cursor.fetchone()
    while row is not None:
        print(row)
        return row

def is_location_correct( id: int, year: int, country: str):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM locations WHERE location_id = {id} AND year >= {year}-5 AND year <= {year}+5 AND country = '{country}';")
    row = cursor.fetchone()
    while row is not None:
        return True
    return False

def get_location_max():
    cursor = connection.cursor()
    cursor.execute(f"SELECT COUNT(*) as max FROM locations;")
    row = cursor.fetchone()
    while row is not None:
        print(row)
        return row

# def a():
#     cursor = connection.cursor()
#     # cursor.execute(f"SELECT count = COUNT(*) FROM locations WHERE location_id = {id} AND year = {year} AND country = '{country}';")
#     result = cursor.fetchall()
#     for row in result:
#         print(row)