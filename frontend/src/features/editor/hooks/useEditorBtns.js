import { useState } from "react";
import { callAI } from "../api/editorApiCall";
import { useHistory } from "@/context/HistoryContext";
import { useAuth } from "@/context/AuthContext";
import { saveGenerazione } from "@/features/history/api/historyApiCall";

/**
 *
 * @param {object} params
 * @param {() => string} params.getEditorText
 * @param {(text: string) => void} params.insertText
 * @param {string|null} params.nomeDocumento - nome documento corrente (null se non salvato)
 */
export const useEditorAI = ({ getEditorText, insertText }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addEntry } = useHistory();
  const { user } = useAuth();

  const handleAction = async (operation) => {
    // --- 1. CARICA FILE DAL TUO PC ---
    if (operation === "upload_local") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".txt"; // Puoi aggiungere .doc, .pdf se il tuo editor li supporta
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          insertText(event.target.result); // Inserisce il contenuto del file nell'editor
        };
        reader.readAsText(file);
      };
      
      input.click(); // Apre la finestra di dialogo del sistema operativo
      return; // Esci per non eseguire la logica AI
    }

    // --- 2. SALVA NEL DATABASE (FLASK + POSTGRES) ---
    if (operation === "save_db") {
      setIsLoading(true);
      try {
        const text = getEditorText();
        const docName = prompt("Inserisci un titolo per il documento:");
        
        if (!docName || !text) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8000/api/save-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // NECESSARIO per inviare il cookie di sessione Flask
          body: JSON.stringify({ nome: docName, contenuto: text })
        });

        const data = await response.json();
        if (data.status === "success") {
          alert("Ottimo! Documento salvato nel database.");
        } else {
          alert("Errore nel salvataggio: " + data.message);
        }
      } catch (err) {
        console.error("Errore di rete:", err);
        alert("Impossibile connettersi al backend.");
      } finally {
        setIsLoading(false);
      }
      return;
    }



    setIsLoading(true);
    try {
      const text = getEditorText();
      const result = await callAI(text, operation);
      insertText(result);

      // salva sul DB solo se utente loggato e documento aperto
      if (user && nomeDocumento) {
        try {
          await saveGenerazione(text, result, nomeDocumento);
        } catch (err) {
          // il salvataggio su DB non blocca il flusso
          console.error("Errore salvataggio generazione su DB:", err);
        }
      }

      // aggiorna sempre lo stato in memoria dopo ogni generazione riuscita(sessione corrente)
      addEntry(operation, text, result);
      
    } catch (err) {
      console.error("Errore:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAction, isLoading };
};