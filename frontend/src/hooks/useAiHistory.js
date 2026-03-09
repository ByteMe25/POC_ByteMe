import { useState, useCallback } from "react";

/**
 * Custom hook che gestisce lo stato e la logica dello storico delle generazioni AI
 *
 * Separare questa logica in un hook ha due vantaggi:
 * 1. App.jsx rimane pulito e responsabile solo della coordinazione dei componenti
 * 2. La logica è riutilizzabile e testabile in isolamento
 * @returns {object} { history, addEntry, removeEntry }
 */

export function useAiHistory() {
  const [history, setHistory] = useState([]);

  /**
   * Aggiunge una nuova voce allo storico
   * useCallback evita che la funzione venga ricreata ad ogni render,
   * importante perché viene passata come prop a componenti figli
   */
  const addEntry = useCallback((operation, result) => {
    const newEntry = {
      id: Date.now(),           // id univoco basato sul timestamp
      operation,                // es. "summary", "fix_grammar", "translate_en"
      result,                   // testo restituito dall'AI
      timestamp: new Date().toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    // Aggiunta in testa: la voce più recente appare prima
    setHistory((prev) => [newEntry, ...prev]);
  }, []);

// Rimuove una voce dallo storico per id
  const removeEntry = useCallback((id) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return { history, addEntry, removeEntry };
}