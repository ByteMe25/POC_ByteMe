from auth import registra_utente, login_utente
from Database.db import execute_write, execute_query

def test_completo():
    print("--- 🧪 INIZIO TEST SISTEMA ---")
    
    email = "studente@progetto.it"
    password = "password_sicura_2026"

    # 1. Registrazione
    print("1. Registrazione utente...")
    if registra_utente(email, password):
        print("✅ Utente creato.")
    else:
        print("❌ Errore registrazione (forse esiste già).")

    # 2. Login
    print("2. Verifica login...")
    if login_utente(email, password):
        print("✅ Login riuscito! La password hashata funziona.")
    else:
        print("❌ Login fallito! Qualcosa non va nell'hashing.")

    # 3. Salvataggio Documento
    print("3. Salvataggio documento...")
    sql_doc = "INSERT INTO DOCUMENTO (Nome, Contenuto_documento, EMail_utente) VALUES (%s, %s, %s) RETURNING ID_documento"
    id_doc = execute_write(sql_doc, ("Appunti AI", "Testo generato...", email))
    
    if id_doc:
        print(f"✅ Documento salvato con ID: {id_doc}")

    # 4. Lettura Finale
    print("4. Lista documenti dell'utente:")
    docs = execute_query("SELECT Nome FROM DOCUMENTO WHERE EMail_utente = %s", (email,))
    for d in docs:
        print(f"  - Documento trovato: {d['nome']}")

if __name__ == "__main__":
    test_completo()