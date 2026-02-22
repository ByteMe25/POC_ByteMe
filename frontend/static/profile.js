const API_URL = "http://localhost:8000/api";

async function loadUserDocs() {
    try {
        const response = await fetch(`${API_URL}/load-documents`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Documenti caricati!", data);
            const filesContainer = document.getElementById("user-files-list");
            filesContainer.innerHTML = ""; // Pulisce la lista prima di aggiungere nuovi elementi

            data.documentList.forEach(doc => {
                const listItem = document.createElement("button");
                listItem.textContent = doc;
                listItem.addEventListener("click", () => {
                openDoc(doc);  
                });
                filesContainer.appendChild(listItem); 
            });

        } else {
            console.error("❌ Caricamento documenti fallito:", data.message);
            alert("Errore durante il caricamento dei documenti!");
        }
    }
    catch (error) {
        console.error("❌ Errore di connessione:", error);
        alert("Errore di connessione durante il caricamento dei documenti.");
    }
}


async function openDoc(docName) {
    try {
        const response = await fetch(`${API_URL}/open-document`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: docName })
        });
        
        const data = await response.json();
        if (response.ok) {
            console.log("✅ Documento aperto!");
            localStorage.setItem("openedDocument", JSON.stringify(data.document));
            window.location.href = "index.html";
        }
        else {
            console.error("❌ Apertura documento fallita:", data.message);
            alert("Errore durante l'apertura del documento!");
        }
    }
    catch (error) {
        console.error("❌ Errore di connessione:", error);
        alert("Errore di connessione durante l'apertura del documento.");
    }
}

addEventListener('DOMContentLoaded', loadUserDocs);