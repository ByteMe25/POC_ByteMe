import { useNavigate } from "react-router-dom";
import { useAiHistory } from "./hooks/useAiHistory";
import { HistoryEntry } from "./components/HistoryEntry";
import styles from "./HistoryPage.module.css";

/**
 * HistoryPage — vista a schermo intero per lo storico delle generazioni AI (/history)
 *
 * nomeDocumento viene letto dallo state del router tramite useLocation,
 * passato da EditorSidebarButtons con navigate("/history", { state: { nomeDocumento } })
 */

export const HistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // modo corretto per leggere lo state del router in React Router v6
  const nomeDocumento = location.state?.nomeDocumento ?? null;
 
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
