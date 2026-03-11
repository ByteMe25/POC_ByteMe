import {loadDocsCall} from "../api/loadDocsCall";
import {useState} from "react";


export const useLoadDocs = () => {
  
  const [error, setError] = useState(null);
  const [docs, setDocs] = useState([]);

  const handleLoadDocs = async () => {
    try {
      const data = await loadDocsCall();
      setDocs(data);
      console.log("Documenti caricati:", data);
    } catch (err) {
      console.log("caught error:", err.message);
      setError("registrazione fallita!!!!");
    }
  };

  return { handleLoadDocs, error, docs };
};