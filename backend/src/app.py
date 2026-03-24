import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from auth import registra_utente, login_utente
from document import apri_documento, crea_storico, get_generazioni_per_storico, recupera_documenti_utente, salva_generazioneAI, salva_nuovo_documento, elimina_generazioneAI
from db.db import execute_query, get_db_session
from db.db import init_db
from ai_strategies import STRATEGIES
from model_strategies import ZucchettiLlamaStrategy,GeminiStrategy
# Test GEMINI
app = Flask(__name__)
CORS(app, supports_credentials=True) # Permette al frontend di parlare con il backend

app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey") # Sempre diversa

models = {
    "zucchetti": ZucchettiLlamaStrategy(),
    "gemini": GeminiStrategy()
}

# Scegli quale usare (magari leggendo da una variabile d'ambiente o fissa)
current_model_name = os.getenv("DEFAULT_AI_MODEL", "zucchetti")
ai_engine = models.get(current_model_name)

if not ai_engine:
    print("❌ ERRORE CRITICO: Nessun motore AI configurato correttamente!")

with app.app_context():
    init_db()

# ----------------------------------------------------------------
# ENDPOINT SALVATAGGIO DOCUMENTI
# ----------------------------------------------------------------
@app.route('/api/save-document', methods=['POST'])
def api_save_document():
    # Verifica sessione
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Effettua il login per salvare"}), 401

    data = request.json
    titolo = data.get('nome')
    contenuto = data.get('contenuto')
    email = session.get('email')

    if not titolo or not contenuto:
        return jsonify({"status": "error", "message": "Dati incompleti"}), 400

    if salva_nuovo_documento(email, titolo, contenuto):
        return jsonify({"status": "success", "message": "Documento salvato"}), 201
    else:
        return jsonify({"status": "error", "message": "Errore interno del server"}), 500

# ----------------------------------------------------------------
# ENDPOINT CARICAMENTO DOCUMENTI
# ----------------------------------------------------------------
@app.route('/api/load-documents', methods=['GET'])
def api_load_documents():
    # Verifica sessione
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Effettua il login per visualizzare i documenti"}), 401

    email = session.get('email')
    documentNames = []

    
    documentNames = recupera_documenti_utente(email)
    if(documentNames is not None):
        return jsonify({"status": "success", "documentList": documentNames})
    else:
        return jsonify({"status": "error", "message": "Errore interno del server"}), 500
    
@app.route('/api/open-document', methods=['POST'])
def api_open_document():
    # Verifica sessione
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Effettua il login per visualizzare i documenti"}), 401
    docName = request.json.get('nome')
    email = session.get('email')
    documentObj = apri_documento(email, docName)
    if(documentObj):
        return jsonify({"status": "success", "document": documentObj}), 200
    else:        
        return jsonify({"status": "error", "message": "Documento non trovato"}), 404



# ----------------------------------------------------------------
# ENDPOINT AUTENTICAZIONE — logica identica alla versione originale
# ----------------------------------------------------------------

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
        session['logged_in'] = True
        session['email'] = data.get('email')
        return jsonify({"status": "authenticated"}), 200
    return jsonify({"status": "denied"}), 401


@app.route('/api/check-auth', methods=['POST'])
def check_auth():
    if session.get('logged_in'):
        return jsonify({
            "authenticated": True,
            "email": session.get('email')
        }), 200
    return jsonify({"authenticated": False}), 200


@app.route('/api/logout', methods=['POST'])
def api_logout():
    if session.get('logged_in'):
        session.clear()
        return jsonify({"status": "logged_out"}), 200
    return jsonify({"status": "not_logged_in"}), 400

@app.route('/api/create-storico', methods=['POST'])
def api_create_storico():
    # Verifica sessione
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Effettua il login per creare lo storico"}), 401
    
    data = request.json
    email = session.get('email')
    docName = data.get('nomeDocumento')

    if not docName:
        return jsonify({"status": "error", "message": "IDDocumento mancante"}), 400

    if crea_storico(email, docName):
        return jsonify({"status": "success", "message": "Storico creato"}), 201
    else:
        return jsonify({"status": "error", "message": "Errore interno del server"}), 500

@app.route('/api/save-ai-generation', methods=['POST'])
def api_save_ai_generation():
    # Verifica sessione
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Effettua il login per salvare la generazione AI"}), 401

    data = request.json
    email = session.get('email')
    docName = data.get('nomeDocumento')
    prompt = data.get('prompt')
    risposta = data.get('risposta')
    

    if not all([docName, prompt, risposta, docName]):
        return jsonify({"status": "error", "message": "Dati mancanti"}), 400

    if salva_generazioneAI(prompt, risposta, docName, email):
        return jsonify({"status": "success", "message": "Generazione AI salvata"}), 201
    else:
        return jsonify({"status": "error", "message": "Errore interno del server"}), 500
    
@app.route('/api/load-storico', methods=['POST'])
def api_load_storico():
    # Verifica sessione
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Effettua il login per caricare lo storico"}), 401

    data = request.json
    email = session.get('email')
    docName = data.get('nomeDocumento')

    if not docName:
        return jsonify({"status": "error", "message": "Nome documento mancante"}), 400

    generazioni = get_generazioni_per_storico(docName, email)
    if generazioni is not None:
        return jsonify({"status": "success", "generazioni": generazioni}), 200
    else:
        return jsonify({"status": "error", "message": "Errore interno del server"}), 500 



@app.route('/api/delete-ai-generation/<int:id_generazione>', methods=['DELETE'])
def api_delete_ai_generation(id_generazione):
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Effettua il login"}), 401

    if elimina_generazioneAI(id_generazione):
        return jsonify({"status": "success", "message": "Generazione eliminata"}), 200
    else:
        return jsonify({"status": "error", "message": "Generazione non trovata"}), 404


# ENDPOINT AI
@app.route('/api/ai/generate', methods=['POST'])
def generate_ai_text():
    """Genera contenuto AI basato su testo, operazione e modello scelto."""
    
    # 1. Recupero dati dalla richiesta frontend 
    data = request.json
    text = data.get('text', '')
    operation = data.get('operation', 'summary')
    
    if not text:
        return jsonify({"generated_text": "❌ Nessun testo fornito."}), 400

    try:
        # 2. PATTERN STRATEGY (CONTENUTO): Costruisci i prompt
        system_prompt, user_prompt = build_prompt(operation, text)
        # 3. PATTERN STRATEGY (MODELLO): Esegui la chiamata
        print(f"🤖 Uso il motore: {type(ai_engine).__name__} per operazione: {operation}")
        result = ai_engine.generate(system_prompt, user_prompt)
        # 4. Pulizia e invio
        result = clean_ai_response(result)
        return jsonify({"generated_text": result}), 200

    except Exception as e:
        print(f"❌ Errore durante la generazione: {e}")
        return jsonify({
            "generated_text": f"❌ Errore critico:\n{str(e)}"
        }), 500

# funzione per rimuovere frasi introduttive AI
def clean_ai_response(text):
    """Rimuove frasi introduttive tipiche delle risposte AI."""
    import re
    
    # possibili pattern ricorrenti da rimuovere (case-insensitive)
    patterns_to_remove = [
        r'^Ecco\s+(un|il|la|i)\s+\w+.*?:\s*',  # "Ecco un riassunto:", "Ecco la traduzione:", ecc.
        r'^Ecco\s+.*?:\s*',                    # "Ecco quanto richiesto:"
        r'^Il\s+riassunto\s+è:\s*',            # "Il riassunto è:"
        r'^La\s+traduzione\s+è:\s*',           # "La traduzione è:"
        r'^Riassunto:\s*',                     # "Riassunto:"
        r'^Traduzione:\s*',                    # "Traduzione:"
        r'^Ecco\s+come\s+.*?:\s*',             # "Ecco come potrei..."
        r'^Di seguito\s+.*?:\s*',              # "Di seguito il testo..."
        r'^Certamente[,!]?\s+',                # "Certamente, ..."
        r'^Certo[,!]?\s+',                     # "Certo, ..."
    ]
    
    cleaned = text
    
    for pattern in patterns_to_remove:
        #rimuove il pattern all'inizio del testo
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    
    #rimuove spazi bianchi iniziali/finali e linee vuote iniziali
    cleaned = cleaned.strip()
    
    #se il testo inizia con una nuova riga la rimuove
    while cleaned.startswith('\n'):
        cleaned = cleaned[1:]
    
    return cleaned



def build_prompt(operation, text):
    """Costruisce i prompt delegando alla strategia corretta."""
    # Recupera la strategia, se non esiste usa 'summary' come default
    strategy = STRATEGIES.get(operation, STRATEGIES['summary'])
    
    # Esegue la strategia
    return strategy.build(text)


# ENDPOINT TEST DB
@app.route('/api/test-db-connection', methods=['GET'])
def test_db():
    try:
        result = execute_query("SELECT 1 as test")
        if result:
            return jsonify({
                "status": "success",
                "message": "✅ Connesso al DB!"
            }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"❌ Errore database: {str(e)}"
        }), 500
    

# ROOT ENDPOINT
@app.route('/')
def root():
    return jsonify({
        #Info api Zucchetti
        "service": "POC ByteMe Backend",
        "ai_configured": bool(ai_client),
        "model": ZUCCHETTI_MODEL if ai_client else None,
        "base_url": OPENAI_BASE_URL if ai_client else None
    })


# AVVIO SERVER
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 ByteMe Second Brain - Backend Flask")
    print("=" * 60)
    app.run(host='0.0.0.0', port=8000, debug=True)