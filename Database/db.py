import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Credenziali per Docker
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "editor_db")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASS = os.getenv("DB_PASS", "password123")

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS
    )

def execute_query(query, params=None):
    """Per leggere dati (SELECT)."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, params)
            return cur.fetchall()

def execute_write(query, params=None):
    """Per scrivere dati (INSERT, UPDATE)."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute(query, params)
                # Recupera l'ID se la query usa RETURNING
                res = cur.fetchone()[0] if "RETURNING" in query.upper() else True
                conn.commit()
                return res
            except Exception as e:
                conn.rollback()
                print(f"Errore SQL: {e}")
                return None