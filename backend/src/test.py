from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import registra_utente, login_utente
from db.db import execute_query

app = Flask(__name__)
CORS(app) # Permette al frontend di parlare con il backend

@app.route('/api/registrazione', methods=['POST'])
def api_registra():
    data = request.json
    successo = registra_utente(data.get('email'), data.get('password'))
    if successo:
        return jsonify({"status": "success"}), 201
    return jsonify({"status": "error"}), 400

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    if login_utente(data.get('email'), data.get('password')):
        return jsonify({"status": "authenticated"}), 200
    return jsonify({"status": "denied"}), 401

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)