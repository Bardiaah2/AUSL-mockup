from flask import Flask, jsonify, make_response, request
from pymongo import MongoClient
import os
import time
from bson.objectid import ObjectId
from dotenv import load_dotenv
import datetime

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)

# MongoDB connection with retry logic
def get_mongo_connection():
    database_url = os.getenv("DATABASE_URL")
    max_retries = 5
    retry_delay = 2  # seconds
    
    for attempt in range(max_retries):
        try:
            client = MongoClient(database_url, serverSelectionTimeoutMS=5000)
            # Verify connection
            client.admin.command('ping')
            print(f"✓ MongoDB connected successfully")
            return client
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"⚠ MongoDB connection failed (attempt {attempt + 1}/{max_retries}): {e}")
                time.sleep(retry_delay)
            else:
                print(f"✗ Failed to connect to MongoDB after {max_retries} attempts")
                raise

client = get_mongo_connection()
db = client["softball"]
collection1 = db["pitching_players"]   # pitching
collection2 = db["players_hitting"]    # hitting
collection3 = db["players"]            # combined
player_info = db["player_info"] 
mvp_points = db["MVP_points"]
win_points = db["Win_points"]
users_collection = db["login"]

# Points values
hitting_values = {
    "Single": 10, "Double": 20, "Triple": 30, "Home Run": 40,
    "Stolen Base": 10, "Caught Stealing": -10,
    "Walk": 10, "HBP": 8, "Sacrifice Fly/Bunt": 10
}
pitching_values = {"out": 4, "allowed run": -10}


# --- Helper functions ---

def calculate_outs(doc):
    ip = doc.get("IP", 0)

    try:
        ip = float(ip)
    except (ValueError, TypeError):
        ip = 0

    whole = int(ip)
    decmial = ip-whole
    decmial = int(round(decmial * 10))
    outs = whole*3 + decmial
    return outs

def calculate_pitching_points(doc):
    outs = int(calculate_outs(doc))

    try:
        er = int(doc.get("ER", 0))
    except (ValueError, TypeError):
        er = 0

    return outs * pitching_values["out"] + er * pitching_values["allowed run"]

def calculate_hitting_points(doc):
    return (
        doc.get("1B", 0) * hitting_values["Single"] +
        doc.get("2B", 0) * hitting_values["Double"] +
        doc.get("3B", 0) * hitting_values["Triple"] +
        doc.get("HR", 0) * hitting_values["Home Run"] +
        doc.get("SB", 0) * hitting_values["Stolen Base"] +
        doc.get("CS", 0) * hitting_values["Caught Stealing"] +
        doc.get("BB", 0) * hitting_values["Walk"] +
        doc.get("HP", 0) * hitting_values["HBP"] +
        (doc.get("SF", 0) + doc.get("SH", 0)) * hitting_values["Sacrifice Fly/Bunt"]
    )

# --- Pitching Stats ---
@app.route("/api/pitchingstats", methods=["GET"])
def get_pitching_stats():
    docs = list(collection1.find({}))
    result = []
    for doc in docs:
        doc_copy = doc.copy()
        doc_copy.pop("_id", None)
        doc_copy["Points"] = calculate_pitching_points(doc)
        result.append(doc_copy)
    return jsonify(result)

@app.route("/api/pitchingstats", methods=["POST"])
def update_pitching_stats():
    docs = list(collection1.find({}))
    for doc in docs:
        doc_id = doc["_id"]
        points = calculate_pitching_points(doc)
        collection1.update_one({"_id": doc_id}, {"$set": {"Points": points}})
    return jsonify({"status": "Pitching points updated"}), 200

# --- Hitting Stats ---
@app.route("/api/hittingstats", methods=["GET"])
def get_hitting_stats():
    docs = list(collection2.find({}))
    result = []
    for doc in docs:
        doc_copy = doc.copy()
        doc_copy.pop("_id", None)
        doc_copy["Points"] = calculate_hitting_points(doc)
        result.append(doc_copy)
    return jsonify(result)

@app.route("/api/hittingstats", methods=["POST"])
def update_hitting_stats():
    docs = list(collection2.find({}))
    for doc in docs:
        doc_id = doc["_id"]
        points = calculate_hitting_points(doc)
        collection2.update_one({"_id": doc_id}, {"$set": {"Points": points}})
    return jsonify({"status": "Hitting points updated"}), 200

# --- MVP Points ---
@app.route("/api/mvp", methods=["GET"])
def get_MVP_points():
    docs = list(mvp_points.find({}))
    result = []
    for doc in docs:
        doc_copy = doc.copy()
        doc_copy.pop("_id", None)
        result.append(doc_copy)
    return jsonify(result)

# --- Win Points ---
@app.route("/api/win", methods=["GET"])
def get_WIN_points():
    docs = list(win_points.find({}))
    result = []
    for doc in docs:
        doc_copy = doc.copy()
        doc_copy.pop("_id", None)
        result.append(doc_copy)
    return jsonify(result)

# --- Combined Points ---
@app.route("/api/points", methods=["GET"])
def get_combined_points():
    docs = list(collection3.find({}))
    result = []
    for doc in docs:
        doc_copy = doc.copy()
        doc_copy.pop("_id", None)
        result.append(doc_copy)
    return jsonify(result)

@app.route("/api/points", methods=["POST"])
def update_combined_points():
    combined = {}

    # Pull pitching points
    for doc in collection1.find({}):
        name = doc.get("Athlete")
        if not name:
            continue

        pitching_points = doc.get("Points", 0)

        try:
            pitching_points = int(pitching_points)
        except ValueError:
            pitching_points = 0

        combined[name] = {
            "Athlete": name,
            "PitchingPoints": pitching_points,
            "HittingPoints": 0,  
            "MVPPoints": 0,
            "WINPoints" : 0

        }
        

    # Pull hitting points
    for doc in collection2.find({}):
        name = doc.get("Athlete")
        if not name:
            continue

        hitting_points = doc.get("Points", 0)

        try:
            hitting_points = int(hitting_points)
        except ValueError:
            hitting_points = 0

        if name in combined:
            combined[name]["HittingPoints"] = hitting_points
        else:
            combined[name] = {
                "Athlete": name,
                "PitchingPoints": 0,
                "HittingPoints": hitting_points
            }

    for doc in mvp_points.find({}):
        name = doc.get("Athlete")
        if not name:
            continue

        mvp_point = doc.get("Total MVP", 0)

        try:
            mvp_point = int(mvp_point)
        except ValueError:
            mvp_point = 0

        if name in combined:
            combined[name]["MVPPoints"] = mvp_point
        else: 
            combined[name] = {
                "Athlete": name,
                "PitchingPoints": 0,
                "HittingPoints": 0,  
                "MVPPoints": mvp_point,
                "WINPoints" : 0
            }
    
    for doc in win_points.find({}):
        name = doc.get("Athlete")
        if not name:
            continue

        win_point = doc.get("Total Win", 0)

        try:
            win_point = int(win_point)
        except ValueError:
            win_point = 0

        if name in combined:
            combined[name]["WINPoints"] = win_point
        else: 
            combined[name] = {
                "Athlete": name,
                "PitchingPoints": 0,
                "HittingPoints": 0,  
                "MVPPoints": 0,
                "WINPoints" : win_point
            }

    # Clear old combined collection and insert new totals
    collection3.delete_many({})
    final_docs = []
    for data in combined.values():
        data["TotalPoints"] = (
            data.get("PitchingPoints", 0) +
            data.get("HittingPoints", 0) +
            data.get("MVPPoints", 0) +
            data.get("WINPoints", 0)
        )
        collection3.insert_one(data)
        final_docs.append(data)

    return jsonify({"status": "Combined points updated", "count": len(final_docs)}), 200

@app.route("/api/player_info", methods=["GET"])
def get_player_info():
    docs = list(player_info.find({}))
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify(docs)


# ⭐ UPDATE/REFRESH PLAYER INFO (re-import after CSV changes)
@app.route("/api/player_info", methods=["POST"])
def update_player_info():
    data = request.get_json()

    if not data or "players" not in data:
        return jsonify({"error": "Expected JSON: { players: [...] }"}), 400

    players = data["players"]

    # Remove old docs
    player_info.delete_many({})

    # Insert new updated docs
    for p in players:
        player_info.insert_one(p)

    return jsonify({"status": "player_info updated", "count": len(players)}), 200


# ⭐ DELETE PLAYER
@app.route("/api/player_info/<player_id>", methods=["DELETE"])
def delete_player(player_id):
    try:
        result = player_info.delete_one({"_id": ObjectId(player_id)})
        if result.deleted_count == 0:
            return jsonify({"status": "no player found"}), 404
    except:
        return jsonify({"error": "Invalid ID format"}), 400
    
    return jsonify({"status": "player deleted"}), 200


@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body is required"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # --- Find user in database ---
        user = users_collection.find_one({"username": username})

        if not user or user.get("password") != password:
            return jsonify({"error": "Invalid username or password"}), 401

        # --- Create cookie session token ---
        cookie_value = str(user["_id"])

        # Cookie expiration (e.g., 30 minutes)
        expire_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)

        resp = make_response(jsonify({"message": "Login successful"}))

        resp.set_cookie(
            "session_id",
            cookie_value,
            expires=expire_time,
            httponly=True,     # JS cannot read it → safer
            secure=False,      # set to True if using HTTPS
            samesite="Lax"
        )

        return resp, 200

    except Exception as e:
        print(f"✗ Login error: {e}")
        return jsonify({"error": f"Login error: {str(e)}"}), 500

if __name__ == "__main__":
    host = os.getenv("HOST", "localhost")
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "production") == "development"
    
    print(f"\n{'='*60}")
    print(f"Starting Flask Backend Server")
    print(f"{'='*60}")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Debug Mode: {debug}")
    print(f"{'='*60}\n")
    
    app.run(host=host, port=port, debug=debug)
