from sqlalchemy import (
    Column, String, Integer, Text, TIMESTAMP, ForeignKey
)
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class Utente(Base):
    __tablename__ = "utente"

    mail = Column("mail", String(255), primary_key=True)
    password = Column("password", String(255), nullable=False)

    documenti = relationship("Documento", back_populates="utente", cascade="all, delete-orphan")
    generazioni = relationship("GenerazioneAI", back_populates="utente")
    storici = relationship("StoricoAI", back_populates="utente")


class AgenteEsterno(Base):
    __tablename__ = "agente_esterno"

    id_agente_esterno = Column("id_agente_esterno", Integer, primary_key=True, autoincrement=True)
    nome_agente_esterno = Column("nome_agente_esterno", String(100))
    provider = Column("provider", String(100))
    versione = Column("versione", String(50))

    generazioni = relationship("GenerazioneAI", back_populates="agente")


class Documento(Base):
    __tablename__ = "documento"

    id_documento = Column("id_documento", Integer, primary_key=True, autoincrement=True)
    nome = Column("nome", String(255))
    contenuto_documento = Column("contenuto_documento", Text)
    data_ora_creazione_documento = Column("data_ora_creazione_documento", TIMESTAMP, server_default=func.now())
    data_ora_ultima_modifica_documento = Column("data_ora_ultima_modifica_documento", TIMESTAMP, server_default=func.now(), onupdate=func.now())
    mail_utente = Column("mail_utente", String(255), ForeignKey("utente.mail", ondelete="CASCADE"))

    utente = relationship("Utente", back_populates="documenti")
    #Uno storico può essere legato a un documento, quindi qui usiamo il plurale
    storici = relationship("StoricoAI", back_populates="documento", cascade="all, delete-orphan")


class GenerazioneAI(Base):
    __tablename__ = "generazione_ai"

    id_generazione = Column("id_generazione", Integer, primary_key=True, autoincrement=True)
    prompt = Column("prompt", Text)
    risposta = Column("risposta", Text)
    data_ora_generazione = Column("data_ora_generazione_ai", TIMESTAMP, server_default=func.now())
    id_agente_esterno = Column("id_agente_esterno", Integer, ForeignKey("agente_esterno.id_agente_esterno"))
    mail_utente = Column("mail_utente", String(255), ForeignKey("utente.mail"))
    id_storicoai = Column("id_storicoai", Integer, ForeignKey("storico_ai.id_storico"))

    agente = relationship("AgenteEsterno", back_populates="generazioni")
    utente = relationship("Utente", back_populates="generazioni")
    
    #'Storico' (singolare) perché punta a UN solo ID.
    storico = relationship("StoricoAI", back_populates="generazioni")


class StoricoAI(Base):
    __tablename__ = "storico_ai"

    id_storico = Column("id_storico", Integer, primary_key=True, autoincrement=True)
    data_ora_creazione_storico = Column("data_ora_creazione_storico", TIMESTAMP, server_default=func.now())
    data_ora_ultima_modifica_storico = Column("data_ora_ultima_modifica_storico", TIMESTAMP, server_default=func.now(), onupdate=func.now())
    id_documento = Column("id_documento", Integer, ForeignKey("documento.id_documento", ondelete="CASCADE"))
    mail_utente = Column("mail_utente", String(255), ForeignKey("utente.mail"))

    documento = relationship("Documento", back_populates="storici")
    utente = relationship("Utente", back_populates="storici")
    
    generazioni = relationship("GenerazioneAI", back_populates="storico")