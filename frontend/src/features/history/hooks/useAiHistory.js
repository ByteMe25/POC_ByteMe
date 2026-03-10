import { useEffect, useState } from "react";
import { useHistory } from "@/context/HistoryContext";
import { useAuth } from "@/context/AuthContext";
import { loadStorico, deleteGenerazione } from "../api/historyApiCall";

/**
 * useAiHistory — hook della feature history
 * - Al mount, carica lo storico dal DB se l'utente è loggato
 * - Gestisce l'eliminazione di una voce (DB + memoria)
 * - Espone lo stato di loading per la UI
 * - Non gestisce l'aggiunta: quella avviene in useEditorAI al momento della generazione
 *
 * @param {string|null} nomeDocumento
 */
export const useAiHistory = (nomeDocumento = null) => {
  const { history, removeEntry, setEntries } = useHistory();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // carica storico dal DB al mount, solo se utente loggato e documento aperto
  useEffect(() => {
    if (!user || !nomeDocumento) return;

    const fetchStorico = async () => {
      setIsLoading(true);
      try {
        const generazioni = await loadStorico(nomeDocumento);
        // normalizza il formato DB al formato in memoria
        const entries = generazioni.map((gen) => ({
          id: gen.id_generazione,
          operation: gen.prompt, // il prompt contiene l'operazione nel POC
          prompt: gen.prompt,
          risposta: gen.risposta,
          timestamp: new Date(gen.data_ora).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setEntries(entries);
      } catch (err) {
        console.error("Errore caricamento storico:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStorico();
  }, [user, nomeDocumento]);

  // elimina una voce: prima dal DB (se loggato), poi dalla memoria
  const handleDelete = async (id) => {
    if (user) {
      try {
        await deleteGenerazione(id);
      } catch (err) {
        console.error("Errore eliminazione:", err);
        return; // non rimuovere dalla memoria se il DB fallisce
      }
    }
    removeEntry(id);
  };

  return { history, handleDelete, isLoading };
};
