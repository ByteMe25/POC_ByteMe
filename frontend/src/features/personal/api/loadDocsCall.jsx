const API_URL = "/api";

export const loadDocsCall = async () => {
    
    const response = await fetch(`${API_URL}/load-documents`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    
    const data = await response.json();
    

    if (!response.ok) {
        throw new Error("Load docs fallito!!");
    }
  

    return data.documentList;

};


/*
@app.route('/api/load-documents', methods=['GET'])
def api_load_documents():
    # Verifica sessione
    if not session.get('logged_in'):
        return jsonify({"status": "error", "message": "Effettua il login per visualizzare i documenti"}), 401

    email = session.get('email')
    documentNames = []

    
    documentNames = recupera_documenti_utente(email)
    if(documentNames is not None):
        return jsonify({"status": "success", "documentList": documentNames})
    else:
        return jsonify({"status": "error", "message": "Errore interno del server"}), 500


*/