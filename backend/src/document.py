from db.db import get_db_session
from db.models import Documento, GenerazioneAI, StoricoAI

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
            
            documenti = session.query(Documento.nome).filter_by(mail_utente=email).all()
            return [doc.nome for doc in documenti]
    except Exception as e:
        print(f"❌ Errore recupero documenti: {e}")
        return []
    

def apri_documento(email, titolo):
    """Recupera il contenuto di un documento specifico per un utente."""
    try:
        with get_db_session() as session:
            doc = session.query(Documento).filter_by(
                mail_utente=email, 
                nome=titolo
            ).first()
            if doc:
                return {
                    "nome": doc.nome,
                    "contenuto": doc.contenuto_documento
                }
            else:
                print(f"⚠️ Documento '{titolo}' non trovato per {email}")
                return None
    except Exception as e:
        print(f"❌ Errore apertura documento: {e}")
        return None
    

"""    ID_generazione SERIAL PRIMARY KEY,
    Prompt TEXT,
    Risposta TEXT,
    Data_ora_generazione_AI TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_agente_esterno INT,
    Mail_utente VARCHAR(255),
    ID_storicoai INT,"""

def crea_storico(email, docName):
    """crea lo storico nel db quando viene creato un nuovo documento"""
    try:
        with get_db_session() as session:
            doc = session.query(Documento).filter_by(mail_utente=email, nome=docName).first()
            if not doc:
                print(f"❌ Documento '{docName}' non trovato per {email}")
                raise ValueError("Documento non trovato")
            
            # Check if storico already exists
            esistente = session.query(StoricoAI).filter_by(id_documento=doc.id_documento).first()
            if esistente:
                print(f"ℹ️ Storico già esistente per '{docName}'")
                return True
            
            nuovo_storico = StoricoAI(
                mail_utente=email,
                id_documento=doc.id_documento
            )
            session.add(nuovo_storico)
            print(f"✅ Storico creato per '{docName}' di {email}")
            return True
    except Exception as e:
        print(f"❌ Errore creazione storico: {e}")
        return False
    
def salva_generazioneAI(prompt, risposta, nomeDoc, email):
    """salva la generazione AI nel db quando viene fatta una richiesta di generazione"""
    try:
        with get_db_session() as session:
            storico = session.query(StoricoAI).filter_by(mail_utente=email).join(Documento, StoricoAI.id_documento == Documento.id_documento).filter(Documento.nome == nomeDoc).first()
            generazione= GenerazioneAI(
                prompt=prompt,
                risposta=risposta,
                id_storicoai=storico.id_storico,
                mail_utente=email
            )
            session.add(generazione)
        print(f"✅ Generazione AI salvata con successo")
        return True
    except Exception as e:
        print(f"❌ Errore salvataggio generazione AI: {e}")
        return False
    
def elimina_generazioneAI(id_generazione):
    """elimina la generazione AI dal db quando viene eliminata una riga dello storico"""
    try:
        with get_db_session() as session:
            generazione = session.query(GenerazioneAI).filter_by(id_generazione=id_generazione).first()
            if generazione:
                session.delete(generazione)
                print(f"✅ Generazione AI con ID {id_generazione} eliminata con successo")
                return True
            else:
                print(f"⚠️ Generazione AI con ID {id_generazione} non trovata")
                return False
    except Exception as e:
        print(f"❌ Errore eliminazione generazione AI: {e}")
        return False