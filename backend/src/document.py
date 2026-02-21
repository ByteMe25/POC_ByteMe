from db.db import get_db_session
from db.models import Documento

def salva_nuovo_documento(email, titolo, contenuto):
    """Salva il documento: se esiste già lo aggiorna, altrimenti ne crea uno nuovo."""
    try:
        print(f"🔵 DEBUG: Tentativo salvataggio documento '{titolo}' per {email}")
        with get_db_session() as session:
            # 1. CERCA: Esiste già un documento con questo titolo per questo utente?
            doc_esistente = session.query(Documento).filter_by(
                mail_utente=email, 
                nome=titolo
            ).first()

            if doc_esistente:
                # 2. AGGIORNA: Se esiste, cambiamo solo il contenuto
                print(f"🔄 DEBUG: Documento trovato. Aggiorno il contenuto di '{titolo}'")
                doc_esistente.contenuto_documento = contenuto
                # Nota: data_ora_ultima_modifica si aggiorna da sola grazie a onupdate=func.now() nel tuo modello
            else:
                # 3. CREA: Se non esiste, aggiungiamo una nuova riga
                print(f"✨ DEBUG: Documento non trovato. Creo una nuova riga per '{titolo}'")
                nuovo_doc = Documento(
                    nome=titolo,
                    contenuto_documento=contenuto,
                    mail_utente=email
                )
                session.add(nuovo_doc)
            
            # Il commit viene effettuato all'uscita dal 'with'
            
        print(f"✅ DEBUG: Operazione su '{titolo}' completata con successo")
        return True
    except Exception as e:
        print(f"❌ ERRORE salvataggio/aggiornamento documento: {e}")
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