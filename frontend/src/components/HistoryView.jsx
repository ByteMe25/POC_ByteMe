import styles from "./HistoryView.module.css";

/**
 * Mappa operation -> etichetta leggibile per il titolo della voce.
 * Definita fuori dal componente perché è una costante.
 */
const OPERATION_LABELS = {
  summary:     "📝 Riassunto",
  fix_grammar: "🔧 Correzione grammaticale",
  translate_en: "🌍 Traduzione in inglese",
};

/**
 * HistoryView — vista a schermo intero per lo storico delle generazioni AI.
 *
 * Responsabilità: mostrare le voci dello storico con le azioni disponibili.
 * NON gestisce stato proprio, NON chiama API.
 *
 * Props:
 * - history: array di voci { id, operation, result, timestamp }
 * - onDelete: (id: number) => void
 * - onBack: () => void — torna alla vista editor
 */
export default function HistoryView({ history, onDelete, onBack }) {
  return (
    <div className={styles.view}>

      <div className={styles.header}>
        <h2 className={styles.title}>🕒 Storico Generazioni</h2>
        <button className={styles.btnBack} onClick={onBack}>
          ← Torna all'editor
        </button>
      </div>

      {history.length === 0 ? (
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
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

    </div>
  );
}

/**
 * HistoryEntry — singola voce dello storico.
 * Separato per SRP: ogni componente ha una sola responsabilità.
 */
function HistoryEntry({ entry, onDelete }) {

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.result);
  };

  return (
    <li className={styles.entry}>

      <div className={styles.entryHeader}>
        <span className={styles.operation}>
          {OPERATION_LABELS[entry.operation] ?? entry.operation}
        </span>
        <span className={styles.timestamp}>{entry.timestamp}</span>
      </div>

      <p className={styles.result}>{entry.result}</p>

      <div className={styles.actions}>
        <button
          className={styles.btnCopy}
          onClick={handleCopy}
          title="Copia il testo"
        >
          📋 Copia
        </button>
        <button
          className={styles.btnDelete}
          onClick={() => onDelete(entry.id)}
          title="Elimina voce"
        >
          🗑 Elimina
        </button>
      </div>

    </li>
  );
}