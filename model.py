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

def get_location_max():
    cursor = connection.cursor()
    cursor.execute(f"SELECT COUNT(*) as max FROM locations;")
    row = cursor.fetchone()
    while row is not None:
        print(row)
        return row

def is_location_correct( id: int, year: int, country: str):
    cursor = connection.cursor()
    cursor.execute(f"SELECT year, country FROM locations WHERE location_id = {id}")
    row = cursor.fetchone()
    result = {
        "points": 0,
        "message_date": "",
        "message_country": "You guessed the wrong country, you got 0 points.",
    }
    points_date = 0
    points_country = 0
    difference = 100000000
    if row is not None:
        row_year = row[0]
        row_country = row[1]
        print(f"is_location_correct INFO: \"{row_year}\", \"{row_country}\"")
        # POINTS FOR THE YEAR GUESS
        difference = abs(row_year - year)
        if difference == 0:
            points_date = 1000
        elif difference <= 10:
            points_date = 500
        elif difference <= 20:
            points_date = 250

        # POINTS FOR THE COUNTRY GUESS
        if row_country == country:
            points_country = 500

    # DATE MESSAGE
    if points_date == 1000:
        result["message_date"] = "You got 1000 points by guessing the exact year!"
    else:
        result["message_date"] = f"You were {difference} years off! You got {points_date} points!"
    # COUNTRY MESSAGE
    if points_country == 500:
        result["message_country"] = f"You got 500 points for guessing the right country"
    # POINTS
    result["points"] += points_country + points_date
    return result


# def a():
#     cursor = connection.cursor()
#     # cursor.execute(f"SELECT count = COUNT(*) FROM locations WHERE location_id = {id} AND year = {year} AND country = '{country}';")
#     result = cursor.fetchall()
#     for row in result:
#         print(row)