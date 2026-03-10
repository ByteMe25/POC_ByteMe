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