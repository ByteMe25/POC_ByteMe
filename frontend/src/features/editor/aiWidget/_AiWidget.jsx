// AiWidget.jsx
import styles from "./AiWidget.module.css";

export const AiWidget = ({ widgetState, onInsert, onClose }) => {
  const { status } = widgetState;

  if (status === "idle") return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.widget}>

        <div className={styles.header}>
          <span className={styles.title}>✨ AI</span>
          {status === "done" && (
            <button className={styles.closeBtn} onClick={onClose} title="Chiudi">✕</button>
          )}
        </div>

        <div className={styles.body}>
          {status === "loading" && (
            <div className={styles.loading}>
              <div>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <p className={styles.loadingText}>Elaborazione in corso…</p>
            </div>
          )}
          {status === "done" && (
            <pre className={styles.result}>{widgetState.result}</pre>
          )}
        </div>

        {status === "done" && (
          <div className={styles.footer}>
            <button className={styles.insertBtn} onClick={onInsert}>
              Inserisci nell&apos;editor
            </button>
            <button className={styles.discardBtn} onClick={onClose}>
              Scarta
            </button>
          </div>
        )}

      </div>
    </div>
  );
};