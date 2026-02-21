from db.db import get_db_session
from db.models import Documento

def salva_nuovo_documento(email, titolo, contenuto):
    """Crea un nuovo record nella tabella documento."""
    try:
        print(f"🔵 DEBUG: Tentativo salvataggio documento '{titolo}' per {email}")
        with get_db_session() as session:
            nuovo_doc = Documento(
                nome=titolo,
                contenuto_documento=contenuto,
                mail_utente=email
            )
            session.add(nuovo_doc)
            # Con get_db_session() il commit è solitamente gestito dal context manager
        print(f"✅ DEBUG: Documento '{titolo}' salvato con successo")
        return True
    except Exception as e:
        print(f"❌ ERRORE salvataggio documento: {e}")
        return False

def recupera_documenti_utente(email):
    """Recupera tutti i documenti di un utente specifico."""
    try:
        with get_db_session() as session:
            # Esempio di come potresti fare la query in futuro per la pagina profilo
            documenti = session.query(Documento).filter_by(mail_utente=email).all()
            return documenti
    except Exception as e:
        print(f"❌ Errore recupero documenti: {e}")
        return []