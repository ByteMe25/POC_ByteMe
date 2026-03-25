import { useEffect } from "react";
import { useEditorAI } from "../hooks/useEditorBtns";
import SidebarButton from "@/components/Sidebar/SidebarButton";
import { useNavigate } from "react-router-dom";
import { useDocName } from "@/context/openedDocContext";

const BUTTONS = [
  { id: "upload",    icon: "📤", tooltip: "Carica file dal PC", operation: "upload_local" },
  { id: "save",      icon: "💾", tooltip: "Salva nel Database", operation: "save_db" },
  { id: "summarize", icon: "📝", tooltip: "Riassumi il testo",  operation: "summary" },
  { id: "fix",       icon: "🔧", tooltip: "Correggi grammatica",operation: "fix_grammar" },
  { id: "translate", icon: "🌍", tooltip: "Traduci in inglese", operation: "translate_en" },
];

export const EditorSidebarButtons = ({ getEditorText, insertText, onAiStateChange }) => {
  const { docName } = useDocName();
  const { handleAction, widgetState, confirmInsert, reset, isSaving } = useEditorAI({
    getEditorText,
    insertText,
    nomeDocumento: docName,
  });
  const navigate = useNavigate();

  useEffect(() => {
    onAiStateChange?.({ widgetState, confirmInsert, reset });
  }, [widgetState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {BUTTONS.map((btn) => (
        <SidebarButton
          key={btn.id}
          icon={btn.icon}
          tooltip={btn.tooltip}
          disabled={widgetState.status === "loading" || isSaving}
          onClick={() => handleAction(btn.operation)}
        />
      ))}

      <hr style={{ border: "none", borderTop: "1px solid #333", margin: "8px 0", width: "100%" }} />

      <SidebarButton
        icon="🕒"
        tooltip="Storico generazioni"
        disabled={false}
        onClick={() => navigate("/history", { state: { nomeDocumento: docName } })}
      />
    </>
  );
};