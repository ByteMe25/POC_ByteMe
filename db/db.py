from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from db.models import Base
import os

# --- Credenziali (invariate rispetto alla versione psycopg2) ---
DB_HOST = os.getenv("DB_HOST", "db")
DB_NAME = os.getenv("DB_NAME", "poc_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def init_db():
    """Crea le tabelle se non esistono (utile per lo sviluppo)."""
    Base.metadata.create_all(bind=engine)


@contextmanager
def get_db_session() -> Session:
    """Context manager che garantisce commit/rollback automatici."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# ----------------------------------------------------------------
# Le due funzioni di comodo che hai già in db.py, riscritte.
# execute_query ora torna una lista di dict (come RealDictCursor).
# execute_write ora torna il primo valore della prima riga se c'è
# RETURNING, oppure True, oppure None in caso di errore.
# ----------------------------------------------------------------

def execute_query(query: str, params: dict | None = None) -> list[dict]:
    """Per leggere dati (SELECT). Ritorna lista di dict."""
    try:
        with get_db_session() as session:
            result = session.execute(text(query), params or {})
            keys = result.keys()
            return [dict(zip(keys, row)) for row in result.fetchall()]
    except Exception as e:
        print(f"Errore SQL (lettura): {e}")
        return []


def execute_write(query: str, params: dict | None = None):
    """Per scrivere dati (INSERT, UPDATE). Ritorna id/True/None."""
    try:
        with get_db_session() as session:
            result = session.execute(text(query), params or {})
            if "RETURNING" in query.upper():
                row = result.fetchone()
                return row[0] if row else None
            return True
    except Exception as e:
        print(f"Errore SQL (scrittura): {e}")
        return None