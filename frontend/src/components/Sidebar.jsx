import { useState } from "react";
import SidebarButton from "./SidebarButton";
import styles from "./Sidebar.module.css";

const BUTTONS = [
  { id: "summarize", icon: "📝", tooltip: "Riassumi il testo",   operation: "summary" },
  { id: "fix",       icon: "🔧", tooltip: "Correggi grammatica", operation: "fix_grammar" },
  { id: "translate", icon: "🌍", tooltip: "Traduci in inglese",  operation: "translate_en" },
];

/**
 * Funzione di chiamata API: definita fuori dal componente perché
 * non dipende da stato o props, è pura logica di servizio.
 * (Da spostare in src/services/aiService.js nell'MVP)
 */
async function callAI(text, operation) {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, operation }),
  });

  if (!response.ok) throw new Error(`Errore API: ${response.status}`);

  const data = await response.json();
  return data.result;
}

/**
 * Sidebar
 *
 * Props:
 * - getEditorText: () => string — legge il testo corrente dall'editor
 * - insertText: (text: string) => void — inserisce testo nell'editor
 * - onResult: (operation: string, result: string) => void
 *     Callback chiamata quando l'AI risponde con successo.
 *     App.jsx usa questa callback per aggiungere la voce allo storico.
 *     La Sidebar non sa nulla dello storico: rispetta SRP.
 */
export default function Sidebar({ getEditorText, insertText, onResult, onNavigateHistory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (operation) => {
    setIsLoading(true);
    try {
      const text = getEditorText();
      const result = await callAI(text, operation);
      insertText(result);
      // Notifica App che c'è un nuovo risultato da aggiungere allo storico
      onResult(operation, result);
    } catch (err) {
      console.error("Errore:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <button className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "<" : ">"}
      </button>

      {isOpen && (
        <div className={styles.buttons}>
          {BUTTONS.map((btn) => (
            <SidebarButton
              key={btn.id}
              icon={btn.icon}
              tooltip={btn.tooltip}
              disabled={isLoading}
              onClick={() => handleAction(btn.operation)}
            />
          ))}
          {/* Separatore visivo tra azioni AI e navigazione */}
          <hr className={styles.divider} />

          <SidebarButton
            icon="🕒"
            tooltip="Storico generazioni"
            disabled={false}
            onClick={onNavigateHistory}
          />
        </div>
      )}
    </div>
  );
}