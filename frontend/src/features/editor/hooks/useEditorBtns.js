import { useState } from "react";
import { callAI } from "../api/editorApiCall";

export const useEditorAI = ({ getEditorText, insertText }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (operation) => {
    setIsLoading(true);
    try {
      const text = getEditorText();
      const result = await callAI(text, operation);
      insertText(result);
    } catch (err) {
      console.error("Errore:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAction, isLoading };
};