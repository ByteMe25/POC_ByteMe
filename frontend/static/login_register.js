const API_URL = "http://localhost:8000/api";

// --- FUNZIONE REGISTRAZIONE ---
async function registraUtente() {
    const emailValue = document.getElementById("emailInput").value;
    const passwordValue = document.getElementById("passwordInput").value;

    console.log("Tentativo di registrazione per:", emailValue);

    try {
        const response = await fetch(`${API_URL}/registrazione`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
                email: emailValue, 
                password: passwordValue 
            })
        });

        const data = await response.json();
        console.log("📩 Risposta server:", data); // ← AGGIUNGI QUESTO per vedere cosa ritorna

        if (response.ok) {
            console.log("✅ Registrazione riuscita:", data);
            alert("Utente registrato con successo!");
            document.getElementById("emailInput").value = "";
            document.getElementById("passwordInput").value = "";
            window.location.href = "Login.html";
        } else {
            console.error("❌ Errore dal server:", data);
            // ← Cambia qui: usa data.status invece di data.errore
            alert("Errore registrazione. Controlla la console per dettagli.");
        }
    } catch (error) {
        console.error("❌ Errore di connessione:", error);
        alert("Impossibile contattare il server!");
    }
}

// --- FUNZIONE LOGIN ---
async function loginUtente() {
    const emailValue = document.getElementById("emailInput").value;
    const passwordValue = document.getElementById("passwordInput").value;

    console.log("Tentativo di login per:", emailValue);

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
                email: emailValue, 
                password: passwordValue 
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Login effettuato!", data);
            //alert("Bentornato! Accesso eseguito.");
            window.location.href = "index.html";
        } else {
            console.error("❌ Login fallito:", data.errore);
            alert("Credenziali errate!");
        }
    } catch (error) {
        console.error("❌ Errore di connessione:", error);
        alert("Errore di connessione durante il login.");
    }
}


