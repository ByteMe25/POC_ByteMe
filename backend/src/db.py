# os - importa il modulo per interagire con il sistema operativo x leggere variabili d'ambiente
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2 #per connettersi a database PostgreSQL (e testare db)
from pydantic import BaseModel
#client ufficiale OpenAI, compatibile con endpoint Zucchetti
from openai import OpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #PERICOLOSO IN PRODUZIONE: permette a TUTTI i domini
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],      
)

DB_CONFIG = {
    'host': 'db',
    'port': '5432',
    'database': 'poc_db',
    'user': 'postgres',
    'password': 'postgres'
}

# === CONFIGURAZIONE ZUCCHETTI ===
base_url = os.environ.get("OPENAI_BASE_URL", "")
api_key = os.environ.get("OPENAI_API_KEY", "")

# MODELLO ZUCCHETTI: si può modificare
ZUCCHETTI_MODEL = "llama3.2:3b"

#log di debug: appare nei log di Docker quando il container si avvia
print("=" * 60)
print("CONFIGURAZIONE ZUCCHETTI:")
print(f"🔑 API Key: {api_key[:10]}..." if api_key else "❌ API Key: Mancante")
print(f"🌐 Base URL: {base_url}")
print(f"🤖 Modello selezionato: {ZUCCHETTI_MODEL}")
print("=" * 60)


#configurazione client
client = None
try:
    client = OpenAI(
        api_key=api_key,
        base_url=base_url
    )
    print("✅ Client OpenAI configurato correttamente")
except Exception as e:
    print(f"❌ Errore configurazione client: {e}")
    # Il client sarà None se: 1) Mancano credenziali, 2) Formato errato, 3) Errore connessione

#modello dati per richieste ai
class AIRequest(BaseModel):
    text: str
    operation: str


# ENDPOINT
# test connessione database
@app.get("/api/test-db-connection")
def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.close()
        return {"status": "success", "message": "Daje che va il DB!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection failed: {str(e)}")


# generazione AI
@app.post("/api/ai/generate")
def generate_ai_text(request: AIRequest):
    """Versione SEMPLICE che funziona"""
    
    print(f"📨 Richiesta: {request.operation}")
    
    if not client:
        return {
            "generated_text": "❌ Client Zucchetti non configurato. Controlla le variabili d'ambiente."
        }
    
    try:
        # esempio prompt per riassunto da mandare a ai
        messages = [
            {"role": "system", "content": "Sei un assistente che riassume testi in italiano."},
            {"role": "user", "content": f"Fai un riassunto breve e chiaro in italiano di:\n\n{request.text}"}
        ]
        
        print(f"🤖 Invio a {ZUCCHETTI_MODEL}...")

         #chiamata effettiva all'API Zucchetti
        response = client.chat.completions.create(
            model=ZUCCHETTI_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=300
        )
        #estrae il contenuto della prima scelta (API posono averne più di una)
        result = response.choices[0].message.content
        print(f"✅ Successo! Risposta: {len(result)} caratteri")
        
        return {"generated_text": result}
        
    except Exception as e:
        print(f"❌ Errore dettagliato: {e}")
        return {
            "generated_text": f"❌ Errore API Zucchetti:\n\n{str(e)[:300]}\n\nConfigurazione attuale:\n• Modello: {ZUCCHETTI_MODEL}\n• Endpoint: {base_url}\n• Operazione: {request.operation}"
        }


# Root per verificare che il backend sia attivo, vedere la configurazione corrente e debug remoto
@app.get("/")
def root():
    return {
        "service": "POC ByteMe Backend",
        "zucchetti": {
            "configured": bool(client),
            "model": ZUCCHETTI_MODEL,
            "base_url": base_url
        }
    }
