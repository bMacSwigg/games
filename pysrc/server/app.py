from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import auth, credentials, firestore, initialize_app
from google.cloud.firestore_v1 import DocumentSnapshot, FieldFilter, Or
import os

from engines.baghchal.board import IllegalMove, Position, Board
from engines.baghchal.game import BaghChal
from engines.baghchal.game_state import GameState, deserialize
from server.thirdparty.middleware import jwt_authenticated

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
    game_state = deserialize(data.get("game_state"))
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

@app.route('/v0/games/baghchal/<game_id>', methods=['POST'])
@jwt_authenticated
def move(game_id: str):
    doc = db.collection('baghchal').document(game_id)
    data = doc.get()
    if not data.exists:
        return "Game %s not found" % game_id, 404

    game = _parse_game(data)

    user = auth.get_user(request.uid).email.lower()
    if user != game["tiger"] and user != game["goat"]:
        return "User %s not authorized to view game %s" % (user, game_id), 403

    game_state = GameState(game["board"], game["turn"], game["captures"])
    baghchal = BaghChal(game_state)
    if (baghchal.is_goat_turn() and user != game["goat"]) or (not baghchal.is_goat_turn() and user != game["tiger"]):
        return "It's not your turn yet", 400

    try:
        p1 = request.json["selected"][0].split(',')
        pos1 = Position(int(p1[0]), int(p1[1]))
        if baghchal.is_goat_turn() and not baghchal.can_goats_move():
            baghchal.goat_place(pos1)
        elif baghchal.is_goat_turn():
            p2 = request.json["selected"][1].split(',')
            pos2 = Position(int(p2[0]), int(p2[1]))
            if baghchal.board.get(pos1) == 'G':
                baghchal.goat_move(pos1, pos2)
            else:
                baghchal.goat_move(pos2, pos1)
        else:
            p2 = request.json["selected"][1].split(',')
            pos2 = Position(int(p2[0]), int(p2[1]))
            if baghchal.board.get(pos1) == 'T':
                if Board.connected(pos1, pos2):
                    baghchal.tiger_move(pos1, pos2)
                else:
                    baghchal.tiger_jump(pos1, pos2)
            else:
                if Board.connected(pos1, pos2):
                    baghchal.tiger_move(pos2, pos1)
                else:
                    baghchal.tiger_jump(pos2, pos1)
    except IllegalMove as e:
        return str(e), 400
    else:
        new_state = {"game_state": baghchal.game_state().serialize()}
        doc.update(new_state)
        game["board"] = baghchal.game_state().board
        game["turn"] = baghchal.game_state().turn
        game["captures"] = baghchal.game_state().captures
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
    games = db.collection('baghchal').where(
        filter=Or(
            [
                FieldFilter("tiger", "==", user),
                FieldFilter("goat", "==", user)
            ]
        )
    ).get()
    ret = list(map(_parse_game, games))
    return jsonify(ret), 200


port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)
