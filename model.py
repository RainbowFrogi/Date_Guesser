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

def is_location_correct(id: int, year: int, country: str):
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT year, country FROM locations WHERE location_id = %s", (id,))
        row = cursor.fetchone()
    except Exception as e:
        print(f"Database error: {e}")
        return {
            "points": 0,
            "message_date": "An error occurred while processing your guess.",
            "message_country": "Unable to verify the country due to an error.",
        }

    if row is None:
        return {
            "points": 0,
            "message_date": "Invalid location ID provided.",
            "message_country": "Invalid location ID provided.",
        }

    row_year, row_country = row
    print(f"is_location_correct INFO: \"{row_year}\", \"{row_country}\"")

    difference = abs(row_year - year)
    direction = "too high" if year > row_year else "too low" if year < row_year else ""

    # Non-linear scoring: Quadratic decay from 1000 to 50 points over 0 to 20 years difference
    if difference >= 20:
        points_date = 0
    else:
        points_date = max(1000 - (difference ** 2) * 950 / 400, 0)

    # POINTS FOR THE COUNTRY GUESS
    points_country = 500 if row_country == country else 0

    # DATE MESSAGE
    if difference == 0:
        message_date = "You got 1000 points by guessing the exact year!"
    elif difference < 20:
        message_date = f"You were {difference} year(s) {direction}! You got {int(points_date)} points."
    else:
        message_date = f"You were {difference} years off! You got {int(points_date)} points."

    # COUNTRY MESSAGE
    message_country = "You got 500 points for guessing the right country." if points_country == 500 else "You guessed the wrong country, you got 0 points."

    # POINTS
    total_points = int(points_date + points_country)

    result = {
        "points": total_points,
        "message_date": message_date,
        "message_country": message_country,
    }

    return result


# def a():
#     cursor = connection.cursor()
#     # cursor.execute(f"SELECT count = COUNT(*) FROM locations WHERE location_id = {id} AND year = {year} AND country = '{country}';")
#     result = cursor.fetchall()
#     for row in result:
#         print(row)