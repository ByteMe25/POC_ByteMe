-- 1. Tabella UTENTE
CREATE TABLE UTENTE (
    Mail VARCHAR(255) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL
);

-- 2. Tabella AGENTE_ESTERNO_AI
CREATE TABLE AGENTE_ESTERNO (
    ID_agente_esterno SERIAL PRIMARY KEY,
    Nome_agente_esterno VARCHAR(100),
    Provider VARCHAR(100),
    Versione VARCHAR(50)
);

-- 3. Tabella DOCUMENTO
CREATE TABLE DOCUMENTO (
    ID_documento SERIAL PRIMARY KEY, --SERIAL = ogni volta che si aggiunge una riga, viene creato in automatico l'ID
    Nome VARCHAR(255),
    Contenuto_documento TEXT,
    Data_ora_creazione_documento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Data_ora_ultima_modifica_documento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Mail_utente VARCHAR(255),
    FOREIGN KEY (Mail_utente) REFERENCES UTENTE(Mail) ON DELETE CASCADE --se l'utente decide di eliminare il suo account, tutti i suoi file spariscono con lui
);

-- 4. Tabella GENERAZIONE_AI
CREATE TABLE GENERAZIONE_AI (
    ID_generazione SERIAL PRIMARY KEY,
    Prompt TEXT,
    Risposta TEXT,
    Data_ora_generazione_AI TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_agente_esterno INT,
    Mail_utente VARCHAR(255),
    ID_storicoai INT,
    FOREIGN KEY (ID_agente_esterno) REFERENCES AGENTE_ESTERNO(ID_agente_esterno),
    FOREIGN KEY (Mail_utente) REFERENCES UTENTE(Mail),
    FOREIGN KEY (ID_storicoai) REFERENCES STORICO_AI(ID_storico)
);

-- 5. Tabella STORICO_AI
CREATE TABLE STORICO_AI (
    ID_storico SERIAL PRIMARY KEY,
    Data_ora_creazione_storico TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Data_ora_ultima_modifica_storico TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_documento INT,
    Mail_utente VARCHAR(255),
    FOREIGN KEY (ID_documento) REFERENCES DOCUMENTO(ID_documento) ON DELETE CASCADE, --Se l'utente cancella un documento specifico, cancella anche lo storico delle modifiche AI legate a quel documento
    FOREIGN KEY (Mail_utente) REFERENCES UTENTE(Mail)
);