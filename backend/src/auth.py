import hashlib
import os
from db.db import execute_write, execute_query

def genera_hash(password):
    """Crea un hash sicuro: salt + hash."""
    salt = os.urandom(16) # Sale casuale di 16 byte
    hash_puro = hashlib.pbkdf2_hmac(
        'sha256', 
        password.encode('utf-8'), 
        salt, 
        100000 # 100k iterazioni per sicurezza
    )
    # Uniamo sale e hash in una stringa esadecimale separata da $
    return salt.hex() + "$" + hash_puro.hex()

def verifica_password(password_inserita, hash_salvato):
    """Confronta password inserita con quella nel DB."""
    try:
        salt_hex, hash_hex = hash_salvato.split("$")
        salt = bytes.fromhex(salt_hex)
        nuovo_hash = hashlib.pbkdf2_hmac(
            'sha256', 
            password_inserita.encode('utf-8'), 
            salt, 
            100000
        )
        return nuovo_hash.hex() == hash_hex
    except Exception:
        return False

def registra_utente(email, password):
    """Salva l'utente con password hashata."""
    hash_sicuro = genera_hash(password)
    sql = "INSERT INTO UTENTE (Mail, Password) VALUES (%s, %s)"
    return execute_write(sql, (email, hash_sicuro))

def login_utente(email, password):
    """Controlla se le credenziali sono valide."""
    sql = "SELECT Password FROM UTENTE WHERE Mail = %s"
    risultato = execute_query(sql, (email,))
    if risultato:
        return verifica_password(password, risultato[0]['password'])
    return False