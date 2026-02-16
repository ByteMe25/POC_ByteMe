const API_URL = "http://localhost:8000/api";

// --- FUNZIONE REGISTRAZIONE ---
async function registraUtente() {
    alert("Pulsante cliccato!");
    //Recuperiamo i valori dagli input dell'HTML tramite ID
    const emailField = document.getElementById("emailInput");
    const passwordField = document.getElementById("passwordInput");

    if (!emailField || !passwordField) {
        console.error("Errore: Non trovo gli input nell'HTML. Controlla gli ID!");
        return;
    }

    const emailValue = emailField.value;
    const passwordValue = passwordField.value;

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

        //Leggiamo la risposta (successo o errore)
        const data = await response.json();

        if (response.ok) {
            console.log("✅ Registrazione riuscita:", data);
            alert("Utente registrato con successo!");
            emailField.value = ""; //Pulisce i campi dopo la registrazione
            passwordField.value = "";
            window.location.href = "Login.html";
        } else {
            console.error("❌ Errore dal server:", data.errore);
            alert("Errore registrazione: " + data.errore);
        }
    } catch (error) {
        console.error("❌ Errore di connessione:", error);
        alert("Impossibile contattare il server. Controlla che il backend sia acceso!");
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


