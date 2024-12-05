from flask import Flask, render_template, send_from_directory
# from random import randint
# import argparse
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
    return render_template("home.html")     #   It returns the "home.html" file from the "templates" folder

@app.route("/result/<result>")
def result(result: str):
    print(result)
    return render_template("result.html", result=result)
    #   It returns the "result.html" file from the "templates" folder
    #   and sets the result variable as the value from the path


# ---------------------
#   START SERVER
# ---------------------
if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000, debug=True)
    #   serves the web-app in the port 3000: http://localhost:3000