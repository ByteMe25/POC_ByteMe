<h1 align="center">POC_ByteMe</h1>

<p align="center">Questa repository ha lo scopo di tracciare i file e la documentazione relativi allo sviluppo del Proof of Concept (PoC) del progetto Second Brain, sviluppato dal gruppo 13 ByteMe del corso di Ingegneria del Software 2025/2026, dell'Università di Padova.</p>
<p align="center"> 
Questo spazio è pensato per raccogliere e condividere tra i membri del gruppo i materiali relativi alla validazione delle tecnologie e degli approcci implementativi che ci permetteranno poi di sviluppare il progetto Second Brain.</p>


## 📂 Struttura della Repository
Il codice è organizzato in modo modulare per separare le responsabilità:
* `backend/`: Logica applicativa in Python, gestione API e integrazione LLM.
* `frontend/`: Interfaccia utente (HTML/CSS/JS) servita tramite Nginx.
* `db/`: Schema SQL e modelli SQLAlchemy per la persistenza su PostgreSQL.


## 🛠 Tecnologie Utilizzate
Il progetto sfrutta un'architettura a microservizi containerizzati:
* **Frontend:** HTML5, CSS3, JavaScript, [EasyMDE](https://easymde.com/) (Editor), Toastify (Notifiche).
* **Backend:** Python 3.14, [Flask](https://flask.palletsprojects.com/) (REST API), Flask-CORS.
* **Database:** [PostgreSQL](https://www.postgresql.org/) (Relazionale), SQLAlchemy (ORM).
* **AI:** Integrazione con modelli LLM tramite API e System Prompting custom.
* **Infrastruttura:** Docker & Docker Compose per l'orchestrazione dei servizi.


## 🚀 Installazione ed esecuzione

### Prerequisiti
Assicurati di avere installato sul tuo sistema:
* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Installazione e Configurazione
1.  **Clona la repository:**
    ```bash
    git clone [https://github.com/byteme25/POC_ByteMe.git](https://github.com/byteme25/POC_ByteMe.git)
    cd POC_ByteMe
    ```
2.  **Configura le variabili d'ambiente:**
    Crea un file `.env` nella root del progetto (non caricato su GitHub per sicurezza) seguendo questo schema:
    ```env
    OPENAI_API_KEY=tua_chiave_qui
    OPENAI_BASE_URL=url_api
    FLASK_SECRET_KEY=chiave_segreta_random
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=poc_db
    ```

### Esecuzione
Per avviare l'intero ecosistema (Frontend, Backend, DB), esegui:
```bash
docker-compose up --build 
```

---

<h2 align="center">Componenti del gruppo:</h2>
<div align="center">

|Membro|Matricola|
|---|---|
Matteo Cuogo | 2111013
Joseph Grant | 1224441
Chiara Grossele | 2101063
Elisa Marchioro | 2111941
Giulia Barzon | 2101074
Tommaso Tombacco | 2076447

</div>

<h2 align="center">Contatti:</h2>
<p align="center">Email: <a href="mailto:7last.swe@gmail.com"><em>byteme2025swe@gmail.com</em></a></p>
<p align="center">Sito: <a href="https://byteme25.github.io/ByteMe/"><em>https://byteme25.github.io/ByteMe/</em></a></p>
