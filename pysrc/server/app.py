from engines.baghchal.game_state import GameState
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import auth, credentials, firestore, initialize_app
from google.cloud.firestore_v1 import DocumentSnapshot, FieldFilter, Or

from pysrc.server.thirdparty.middleware import jwt_authenticated


# Initialize Flask app
app = Flask(__name__)
_ORIGINS = ["http://localhost:4200",
            "https://games-869102415447.us-central1.run.app",
            "https://games.mcswiggen.me"]
CORS(app, resources={r"*": {"origins": _ORIGINS}})

# Uses application default credentials, so only works on GCP
initialize_app()
db = firestore.client()


def _parse_game(data: DocumentSnapshot) -> dict:
    game_state = GameState(data.get("game_state"))
    tiger = data.get("tiger")
    goat = data.get("goat")
    return {"id": data.id, "board": game_state.board, "turn": game_state.turn,
            "captures": game_state.captures, "tiger": tiger, "goat": goat}

@app.route('/v0/games/baghchal/<game_id>', methods=['GET'])
@jwt_authenticated
def get_game(game_id: str):
    data = db.collection('baghchal').document(game_id).get()
    if not data.exists:
        return "Game %s not found" % game_id, 404

    game = _parse_game(data)

    user = auth.get_user(request.uid).email.lower()
    if user != game["tiger"] and user != game["goat"]:
        return "User %s not authorized to view game %s" % (user, game_id), 403

    return jsonify(game), 200

@app.route('/v0/games/baghchal', methods=['POST'])
@jwt_authenticated
def create_game():
    try:
        tiger = request.json['tiger'].lower()
        goat = request.json['goat'].lower()

        user = auth.get_user(request.uid).email.lower()
        if user != tiger and user != goat:
            return "User %s must be one of the players" % user, 403
    except KeyError:
        return "Missing property", 400
    else:
        game_state = GameState()
        game = db.collection('baghchal').document()
        game.set({
            "game_state": game_state.serialize(),
            "tiger": tiger,
            "goat": goat,
        })
        return game.id, 200

@app.route('/v0/games/baghchal', methods=['GET'])
@jwt_authenticated
def list_games():
    user = auth.get_user(request.uid).email.lower()
    games = db.where(
        filter=Or(
            [
                FieldFilter("tiger", "==", user),
                FieldFilter("goat", "==", user)
            ]
        )
    ).get()
    ret = list(map(_parse_game, games))
    return jsonify(ret), 200