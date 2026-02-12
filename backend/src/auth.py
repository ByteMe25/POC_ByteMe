import hashlib
import os
from db.db import execute_write, execute_query

def genera_hash(password):
    """Crea un hash sicuro: salt + hash."""
    salt = os.urandom(16)
    hash_puro = hashlib.pbkdf2_hmac(
        'sha256', 
        password.encode('utf-8'), 
        salt, 
        100000 
    )
    return salt.hex() + "$" + hash_puro.hex()

def verifica_password(password_inserita, hash_salvato):
    """Confronta password inserita con quella nel DB."""
    try:
        #Se l'hash nel DB è vuoto o None, falliamo subito
        if not hash_salvato:
            return False
            
        salt_hex, hash_hex = hash_salvato.split("$")
        salt = bytes.fromhex(salt_hex)
        nuovo_hash = hashlib.pbkdf2_hmac(
            'sha256', 
            password_inserita.encode('utf-8'), 
            salt, 
            100000
        )
        return nuovo_hash.hex() == hash_hex
    except Exception as e:
        print(f"Errore durante verifica_password: {e}")
        return False

def registra_utente(email, password):
    """Salva l'utente con password hashata."""
    try:
        hash_sicuro = genera_hash(password)
        sql = "INSERT INTO UTENTE (Mail, Password) VALUES (%s, %s)"
        return execute_write(sql, (email, hash_sicuro))
    except Exception as e:
        print(f"Errore registrazione: {e}")
        return False

def login_utente(email, password):
    """Controlla se le credenziali sono valide."""
    sql = "SELECT Password FROM UTENTE WHERE Mail = %s"
    risultato = execute_query(sql, (email,))
    
    print(f"DEBUG: Risultato query login per {email}: {risultato}")

    if risultato and len(risultato) > 0:
        # Questo evita il crash se il DB restituisce 'Password' invece di 'password'
        utente_dict = risultato[0]
        hash_db = utente_dict.get('password') or utente_dict.get('Password')
        
        if hash_db:
            return verifica_password(password, hash_db)
        else:
            print("ERRORE: La colonna Password non è stata trovata nel risultato!")
            
    return False