import { useNavigate } from "react-router-dom";
import { useAiHistory } from "./hooks/useAiHistory";
import { HistoryEntry } from "./components/HistoryEntry";
import styles from "./HistoryPage.module.css";

/**
 * HistoryPage — vista a schermo intero per lo storico delle generazioni AI (/history)
 *
 * Segue lo stesso pattern di EditorPage:
 * - delega la logica all'hook useAiHistory
 * - assembla i componenti senza conoscere i dettagli
 *
 * @param {string|null} nomeDocumento - passato come prop da router state
 */
export const HistoryPage = () => {
  const navigate = useNavigate();

  // Recupera il nome documento dallo state del router se disponibile
  // (EditorPage lo passerà tramite navigate("/history", { state: { nomeDocumento } }))
  const nomeDocumento = window.history.state?.usr?.nomeDocumento ?? null;

  const { history, handleDelete, isLoading } = useAiHistory(nomeDocumento);

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h2 className={styles.title}>🕒 Storico Generazioni</h2>
        <button className={styles.btnBack} onClick={() => navigate(-1)}>
          ← Torna all'editor
        </button>
      </div>

      {isLoading ? (
        <div className={styles.empty}>
          <p>Caricamento storico...</p>
        </div>
      ) : history.length === 0 ? (
        <div className={styles.empty}>
          <p>Nessuna generazione salvata per questa sessione.</p>
          <p>Le risposte AI appariranno qui dopo ogni operazione.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {history.map((entry) => (
            <HistoryEntry
              key={entry.id}
              entry={entry}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

    </div>
  );
};
