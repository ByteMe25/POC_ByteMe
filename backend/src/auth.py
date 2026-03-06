import hashlib
import os
from db.db import get_db_session
from db.models import Utente


# ----------------------------------------------------------------
# Hashing — logica identica alla versione originale
# ----------------------------------------------------------------

def genera_hash(password: str) -> str:
    """Crea un hash sicuro: salt + hash."""
    salt = os.urandom(16)
    hash_puro = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100_000
    )
    return salt.hex() + "$" + hash_puro.hex()


def verifica_password(password_inserita: str, hash_salvato: str) -> bool:
    """Confronta la password inserita con quella nel DB."""
    try:
        if not hash_salvato:
            return False
        salt_hex, hash_hex = hash_salvato.split("$")
        salt = bytes.fromhex(salt_hex)
        nuovo_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password_inserita.encode('utf-8'),
            salt,
            100_000
        )
        return nuovo_hash.hex() == hash_hex
    except Exception as e:
        print(f"Errore durante verifica_password: {e}")
        return False


# ----------------------------------------------------------------
# Funzioni ORM — stessi nomi di prima
# ----------------------------------------------------------------

def registra_utente(email: str, password: str) -> bool:
    """Salva l'utente con password hashata."""
    try:
        print(f"🔵 DEBUG: Tentativo registrazione per {email}")
        with get_db_session() as session:
            nuovo_utente = Utente(
                mail=email,
                password=genera_hash(password)
            )
            session.add(nuovo_utente)
            print(f"✅ DEBUG: Utente {email} aggiunto con successo")
        return True
    except Exception as e:
        print(f"❌ ERRORE registrazione completo: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()  # Questo stampa lo stack trace completo
        return False


def login_utente(email: str, password: str) -> bool:
    """Controlla se le credenziali sono valide."""
    try:
        with get_db_session() as session:
            utente = session.get(Utente, email)
            if utente is None:
                return False
            return verifica_password(password, utente.password)
    except Exception as e:
        print(f"Errore login: {e}")
        return False