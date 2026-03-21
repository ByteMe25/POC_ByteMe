import { useState } from "react";
import { callAI } from "../api/editorApiCall";
import { useHistory } from "@/context/HistoryContext";
import { useAuth } from "@/context/AuthContext";
import { saveGenerazione } from "@/features/history/api/historyApiCall";
import { EditorCommands } from "./EditorCommands";
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
    setIsLoading(true);

    // Context da passare ai comandi
    const context = {
      getEditorText,
      insertText,
      operation,
      callAI, // la tua funzione API
      saveToHistory: async (original, result) => {
        if (user && nomeDocumento) {
          try {
            await saveGenerazione(original, result, nomeDocumento);
          } catch (err) { console.error("History DB error", err); }
        }
        addEntry(operation, original, result);
      }
    };

    try {
      if (operation === "upload_local") {
        await EditorCommands.upload_local(context);
      } else if (operation === "save_db") {
        await EditorCommands.save_db(context);
      } else {
        // Tutte le altre operazioni (summary, fix_grammar, ecc.) sono gestite dall'AI
        await EditorCommands.ai_operation(context);
      }
    } catch (err) {
      console.error("Command Execution Error:", err);
      alert(err.message || "Si è verificato un errore");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAction, isLoading };
};