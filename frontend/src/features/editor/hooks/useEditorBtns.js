import { useState } from "react";
import { callAI } from "../api/editorApiCall";
import { useHistory } from "@/context/HistoryContext";
import { useAuth } from "@/context/AuthContext";
import { saveGenerazione } from "@/features/history/api/historyApiCall";

/**
 * useEditorAI — hook della feature editor
 * 
 * @param {object} params
 * @param {() => string} params.getEditorText
 * @param {(text: string) => void} params.insertText
 * @param {string|null} params.nomeDocumento - nome documento corrente, dal DocNameContext via EditorSidebarButtons
 */

export const useEditorAI = ({ getEditorText, insertText, nomeDocumento = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addEntry } = useHistory();
  const { user } = useAuth();

  const handleAction = async (operation) => {
    // --- 1. CARICA FILE DAL TUO PC ---
    if (operation === "upload_local") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".txt"; // si possono aggiungere .doc, .pdf se l'editor li supporta
      
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

        // URL relativo — funziona sia in Docker (nginx proxy) sia in sviluppo locale
        const response = await fetch("/api/save-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nome: docName, contenuto: text }),
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


    // --- 3. OPERAZIONI AI ---
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
          // il salvataggio su DB non blocca il flusso UI
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