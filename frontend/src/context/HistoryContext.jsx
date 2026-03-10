import { createContext, useContext, useState } from "react";

/**
 * HistoryContext — stato globale dello storico delle generazioni A
 *
 * Stesso pattern di AuthContext: il Context gestisce lo stato in memoria (sessione corrente), 
 * mentre la persistenza su DB è delegata alle API chiamate dai componenti che ne hanno bisogno.
 * Wrappa l'intera app in main.jsx accanto ad AuthProvider.
 */

const HistoryContext = createContext(null);

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  /**
   * Aggiunge una voce in testa allo storico in memoria
   * Chiamato da useEditorAI dopo ogni generazione riuscita
   * @param {string} operation
   * @param {string} prompt
   * @param {string} risposta
   * @param {number|null} id
   */
  const addEntry = (operation, prompt, risposta, id = null) => {
    const newEntry = {
      id: id ?? Date.now(), // fallback su timestamp se non loggato
      operation,
      prompt,
      risposta,
      timestamp: new Date().toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  /**
   * Rimuove una voce dallo storico in memoria per id
   * Chiamato da useAiHistory dopo eliminazione riuscita sul DB
   */
  const removeEntry = (id) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  /**
   * Sostituisce tutto lo storico in memoria con quello caricato dal DB
   * Chiamato da useAiHistory al mount della HistoryPage
   */
  const setEntries = (entries) => {
    setHistory(entries);
  };

  return (
    <HistoryContext.Provider value={{ history, addEntry, removeEntry, setEntries }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
