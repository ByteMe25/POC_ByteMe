import { useState } from "react";
import { callAI } from "../api/editorApiCall";
import { useHistory } from "@/context/HistoryContext";
import { useAuth } from "@/context/AuthContext";
import { saveGenerazione } from "@/features/history/api/historyApiCall";

const IDLE    = { status: "idle" };
const LOADING = { status: "loading" };
const done    = (result) => ({ status: "done", result });

export const useEditorAI = ({ getEditorText, insertText, nomeDocumento = null }) => {
  const [widgetState, setWidgetState] = useState(IDLE);
  const [isSaving, setIsSaving] = useState(false);
  const { addEntry } = useHistory();
  const { user } = useAuth();

  const transitions = {
    start:   ()       => setWidgetState(LOADING),
    resolve: (result) => setWidgetState(done(result)),
    reset:   ()       => setWidgetState(IDLE),
  };

  const handleAction = async (operation) => {
    if (operation === "upload_local") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".txt";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => insertText(event.target.result);
        reader.readAsText(file);
      };
      input.click();
      return;
    }

    if (operation === "save_db") {
      setIsSaving(true);
      try {
        const text = getEditorText();
        const docName = prompt("Inserisci un titolo per il documento:");
        if (!docName || !text) return;

        const response = await fetch("/api/save-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nome: docName, contenuto: text }),
        });
        const data = await response.json();
        alert(data.status === "success"
          ? "Ottimo! Documento salvato nel database."
          : "Errore nel salvataggio: " + data.message);
      } catch (err) {
        console.error("Errore di rete:", err);
        alert("Impossibile connettersi al backend.");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // --- OPERAZIONI AI ---
    transitions.start();
    try {
      const text = getEditorText();
      const result = await callAI(text, operation);
      transitions.resolve(result);

      if (user && nomeDocumento) {
        try { await saveGenerazione(text, result, nomeDocumento); }
        catch (err) { console.error("Errore salvataggio generazione su DB:", err); }
      }
      addEntry(operation, text, result);

    } catch (err) {
      console.error("Errore:", err);
      transitions.reset();
    }
  };

  const confirmInsert = () => {
    if (widgetState.status === "done") insertText(widgetState.result);
    transitions.reset();
  };

  return { handleAction, widgetState, confirmInsert, reset: transitions.reset, isSaving };
};