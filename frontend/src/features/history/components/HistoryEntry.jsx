import styles from "./HistoryEntry.module.css";

const OPERATION_LABELS = {
  summary:      "📝 Riassunto",
  fix_grammar:  "🔧 Correzione grammaticale",
  translate_en: "🌍 Traduzione in inglese",
  translate_it: "Traduzione in italiano",
  translate_es: "Traduzione in spagnolo",
  translate_fr: "Traduzione in francese",
  translate_de: "Traduzione in tedesco",
  translate_zh: "Traduzione in cinese",
  rewrite:      "✏️ Riscrittura",
  white_hat:    "⚪ Cappello Bianco",
  red_hat:      "🔴 Cappello Rosso",
  black_hat:    "⚫ Cappello Nero",
  yellow_hat:   "🟡 Cappello Giallo",
  green_hat:    "🟢 Cappello Verde",
  blue_hat:     "🔵 Cappello Blu",
};

/**
 * HistoryEntry — componente presentazionale per la singola voce
 * - entry: { id, operation, risposta, timestamp }
 * - onDelete: (id) => void
 */
export const HistoryEntry = ({ entry, onDelete }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(entry.risposta);
  };

  return (
    <li className={styles.entry}>
      <div className={styles.header}>
        <span className={styles.operation}>
          {OPERATION_LABELS[entry.operation] ?? entry.operation}
        </span>
        <span className={styles.timestamp}>{entry.timestamp}</span>
      </div>

      <p className={styles.risposta}>{entry.risposta}</p>

      <div className={styles.actions}>
        <button className={styles.btnCopy} onClick={handleCopy}>
          📋 Copia
        </button>
        <button className={styles.btnDelete} onClick={() => onDelete(entry.id)}>
          🗑 Elimina
        </button>
      </div>
    </li>
  );
};
