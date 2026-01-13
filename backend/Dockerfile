FROM python:3.14.2-slim
# importa un'immagine lightweight (slim) di python già pronta all'uso

WORKDIR /app
# cartella di lavoro di default

COPY requirements.txt requirements.txt
# copia il file requirements.txt nella cartella in WORKDIR
# requirements.txt specifica le librerie usate da python

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*
# installa client postgres per interagire con db tramite docker exec

RUN pip install --no-cache-dir -r requirements.txt
# usa contenuti copiati da requirements.txt per installare le librerie python

# COPY src/ .
# mette src nella cartella di lavoro