import { useState } from "react";
import SidebarButton from "./SidebarButton";
import styles from "./Sidebar.module.css";

const BUTTONS = [
  { id: "summarize", icon: "📝", tooltip: "Riassumi il testo",    operation: "summary" },
  { id: "fix",       icon: "🔧", tooltip: "Correggi grammatica",  operation: "fix_grammar" },
  { id: "translate", icon: "🌍", tooltip: "Traduci in inglese",   operation: "translate_en" },
];

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

export default function Sidebar({ getEditorText, insertText }) {
  const [isOpen, setIsOpen] = useState(false);
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
        </div>
      )}
    </div>
  );
}