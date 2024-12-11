from flask import Flask, jsonify, render_template, request, send_from_directory
from model import get_location, get_location_max, is_location_correct
from random import randint
import random
# import json
# import mysql.connector

# ---------------------
#   CONFIGURATION
# ---------------------
# Server
app = Flask(__name__, template_folder='templates')#, static_folder='public')
# ---------------------
#   FUNCTIONS
# ---------------------
# ---------------------
#   ROUTES
# ---------------------
# STATIC ---------------------
@app.route('/public/<path:filename>')
def public(filename):
    return send_from_directory('public', filename, as_attachment=True) # SERVER FILE FROM FOLDER 'PUBLIC'       # app.static_folder
    # TRY localhost:3000/public/css/style.css to understand how this route works.

# DYNAMIC ---------------------
@app.route("/")
def home():
    # The following function is considered a templating engine/processor/parser
    return render_template("home.html")     #   It returns the "home.html" file from the "templates" folder

@app.route("/game")
def game():
    # The following function is considered a templating engine/processor/parser
    return render_template("game.html")     #   It returns the "home.html" file from the "templates" folder

@app.route("/game/result/<result>")
def result(result: str):
    # The following function is considered a templating engine/processor/parser
    return render_template("result.html", result=result)     #   It returns the "result.html" file from the "templates" folder

# @app.route("/api/guess/<id>/<year>/<country>")
# def result(id: int, year: int, country: str):
# print(result)
#   # The following function is considered a templating engine/processor/parser
#     return render_template("result.html", result=result)
#     #   It returns the "result.html" file from the "templates" folder
#     #   and sets the result variable as the value from the path

@app.route("/api/game/location/random/", methods=["POST"])
def api_game_location_random():
    string_body = list(request.get_json())
    body = [int(item) for item in string_body]
    max = get_location_max()
    allnums = list(range(1, max[0]+1))
    available_nums = [item for item in allnums if item not in body]
    print("available numbers")
    print(available_nums)
    print(body)
    print(type(body))
    random_location = random.choice(available_nums)
    place = get_location(random_location)
    print("place 1 = ", place)
    place = {
        "location_id": place[0],
        "path": place[1],
        "description" : place[2]
    }
    return jsonify(place)

@app.route("/api/game/guess/", methods=["POST"])
def api_game_guess():
    body = request.get_json()
    answer = is_location_correct(body["id"], body["year"], body["country"])
    return answer


@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

# ---------------------
#   START SERVER
# ---------------------
if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000, debug=True)
    #   serves the web-app in the port 3000: http://localhost:3000