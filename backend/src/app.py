import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from auth import registra_utente, login_utente
from document import salva_nuovo_documento
from db.db import execute_query
from db.db import init_db

# CONFIGURAZIONE OPENAI (LLM)
try:
    from openai import OpenAI
    
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "")
    ZUCCHETTI_MODEL = "llama3.2:3b"
    
    # Crea client OpenAI se le credenziali sono presenti
    ai_client = OpenAI(
        api_key=OPENAI_API_KEY,
        base_url=OPENAI_BASE_URL
    ) if OPENAI_API_KEY and OPENAI_BASE_URL else None
    
    print("=" * 60)
    print("CONFIGURAZIONE ZUCCHETTI:")
    print(f"🔑 API Key: {OPENAI_API_KEY[:10]}..." if OPENAI_API_KEY else "❌ API Key: Mancante")
    print(f"🌐 Base URL: {OPENAI_BASE_URL}")
    print(f"🤖 Modello: {ZUCCHETTI_MODEL}")
    print(f"✅ Client: {'Attivo' if ai_client else '❌ Non configurato'}")
    print("=" * 60)
    
except ImportError:
    ai_client = None
    print("⚠️ Libreria 'openai' non installata. Endpoint AI non disponibile.")


app = Flask(__name__)
CORS(app, 
     origins=["http://localhost:8080"],
     supports_credentials=True) # Permette al frontend di parlare con il backend

app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey") # Sempre diversa

# Crea le tabelle al primo avvio (utile in sviluppo; in prod usa Alembic)
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

# ENDPOINT AI
@app.route('/api/ai/generate', methods=['POST'])
def generate_ai_text():
    """Genera contenuto AI basato su testo e operazione."""
    
    print(f"📨 Richiesta AI ricevuta")
    
    if not ai_client:
        return jsonify({
            "generated_text": "❌ Client Zucchetti non configurato. Controlla le variabili d'ambiente."
        }), 500
    
    try:
        data = request.json
        text = data.get('text', '')
        operation = data.get('operation', 'summary')
        
        if not text:
            return jsonify({
                "generated_text": "❌ Nessun testo fornito."
            }), 400
        
        print(f"🤖 Operazione: {operation}")
        
        # Costruisci il prompt in base all'operazione
        system_prompt, user_prompt = build_prompt(operation, text)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        print(f"🤖 Invio a {ZUCCHETTI_MODEL}...")
        
        # Chiamata all'API Zucchetti
        response = ai_client.chat.completions.create(
            model=ZUCCHETTI_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        result = response.choices[0].message.content
        #per rimuovere frasi introduttive che AI mette di default:
        result = clean_ai_response(result)

        print(f"✅ Successo! Risposta: {len(result)} caratteri")
        
        return jsonify({"generated_text": result}), 200
        
    except Exception as e:
        print(f"❌ Errore dettagliato: {e}")
        return jsonify({
            "generated_text": f"❌ Errore API Zucchetti:\n\n{str(e)[:300]}\n\nConfigurazione:\n• Modello: {ZUCCHETTI_MODEL}\n• Endpoint: {OPENAI_BASE_URL}\n• Operazione: {operation}"
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
    """Costruisce system e user prompt in base all'operazione."""
    
    prompts = {
        'summary': (
            "Sei un assistente che riassume testi in italiano in modo chiaro e conciso. NON usare frasi introduttive, rispondi SOLO con il riassunto.",
            f"Fai un riassunto breve e chiaro in italiano di:\n\n{text}"
        ),
        'fix_grammar': (
            "Sei un correttore di bozze che corregge errori grammaticali e ortografici in italiano. NON usare frasi introduttive. Rispondi SOLO con il testo corretto.",
            f"Correggi eventuali errori grammaticali e ortografici nel seguente testo:\n\n{text}"
        ),
        'rewrite': (
            "Sei un editor che riscrive testi migliorandone la chiarezza e lo stile, mantenendo il significato originale. NON usare frasi introduttive. Rispondi SOLO con il testo riscritto.",
            f"Riscrivi il seguente testo migliorandone la chiarezza:\n\n{text}"
        ),
        'distant_writing': (
            "Sei uno scrittore creativo che espande idee e concetti in testi più articolati. NON usare frasi introduttive. Rispondi SOLO con il testo creato.",
            f"Espandi e sviluppa il seguente concetto in un testo più articolato:\n\n{text}"
        ),
        
        # Cappelli di De Bono
        'white_hat': (
            "Sei un analista oggettivo. Usa il Cappello Bianco: concentrati solo su dati, fatti e informazioni verificabili.",
            f"Analizza il seguente testo dal punto di vista dei dati e dei fatti:\n\n{text}"
        ),
        'red_hat': (
            "Sei un analista emotivo. Usa il Cappello Rosso: concentrati sulle emozioni, intuizioni e sentimenti.",
            f"Analizza il seguente testo dal punto di vista emotivo:\n\n{text}"
        ),
        'black_hat': (
            "Sei un critico costruttivo. Usa il Cappello Nero: identifica rischi, problemi e criticità.",
            f"Analizza il seguente testo identificando rischi e criticità:\n\n{text}"
        ),
        'yellow_hat': (
            "Sei un ottimista strategico. Usa il Cappello Giallo: concentrati su benefici e opportunità.",
            f"Analizza il seguente testo identificando benefici e opportunità:\n\n{text}"
        ),
        'green_hat': (
            "Sei un pensatore creativo. Usa il Cappello Verde: genera idee nuove e soluzioni creative.",
            f"Analizza il seguente testo con creatività, proponendo idee alternative:\n\n{text}"
        ),
        'blue_hat': (
            "Sei un organizzatore strategico. Usa il Cappello Blu: struttura il processo e definisci i prossimi passi.",
            f"Analizza il seguente testo organizzando il processo:\n\n{text}"
        ),
        
        # Traduzioni
        'translate_it': (
            "Sei un traduttore professionista. Rispondi SOLO con il testo tradotto, senza frasi introduttive.",
            f"Traduci in italiano:\n\n{text}"
        ),
        'translate_en': (
            "Sei un traduttore professionista. Rispondi SOLO con il testo tradotto, senza frasi introduttive.",
            f"Traduci in inglese:\n\n{text}"
        ),
        'translate_es': (
            "Sei un traduttore professionista. Rispondi SOLO con il testo tradotto, senza frasi introduttive.",
            f"Traduci in spagnolo:\n\n{text}"
        ),
        'translate_fr': (
            "Sei un traduttore professionista. Rispondi SOLO con il testo tradotto, senza frasi introduttive.",
            f"Traduci in francese:\n\n{text}"
        ),
        'translate_de': (
            "Sei un traduttore professionista. Rispondi SOLO con il testo tradotto, senza frasi introduttive.",
            f"Traduci in tedesco:\n\n{text}"
        ),
        'translate_zh': (
            "Sei un traduttore professionista. Rispondi SOLO con il testo tradotto, senza frasi introduttive.",
            f"Traduci in cinese mandarino:\n\n{text}"
        )
    }
    
    return prompts.get(operation, prompts['summary']) #fallback su summary se ci sono errori con altre operazioni


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