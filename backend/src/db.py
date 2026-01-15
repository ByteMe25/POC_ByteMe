# gestione db tramite FastAPI

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from typing import List, Annotated

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],      
)

#informazioni prese da dokcer-compose.yml
DB_CONFIG = {
    'host': 'host.docker.internal',
    'port': '5432',
    'database': 'poc_db',
    'user': 'postgres',
    'password': 'postgres'
}

@app.get("/api/test-db-connection")
def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.close()
        return {"message": "Connection successful!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection failed: {str(e)}")
    
