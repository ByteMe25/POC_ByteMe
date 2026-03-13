import { useEditorAI } from "../hooks/useEditorBtns";
import SidebarButton from "@/components/Sidebar/SidebarButton";
import { useNavigate } from "react-router-dom";
import { useDocName } from "@/context/openedDocContext";

const BUTTONS = [
  { id: "upload",    icon: "📤", tooltip: "Carica file dal PC", operation: "upload_local" },
  { id: "save",      icon: "💾", tooltip: "Salva nel Database", operation: "save_db" },
  { id: "summarize", icon: "📝", tooltip: "Riassumi il testo",   operation: "summary" },
  { id: "fix",       icon: "🔧", tooltip: "Correggi grammatica", operation: "fix_grammar" },
  { id: "translate", icon: "🌍", tooltip: "Traduci in inglese",  operation: "translate_en" },
];

export const EditorSidebarButtons = ({ getEditorText, insertText }) => {
  // docName letto dal context globale — viene impostato da PersonalArea quando l'utente apre un documento
  const { docName } = useDocName();
  const { handleAction, isLoading } = useEditorAI({ getEditorText, insertText, nomeDocumento: docName });
  const navigate = useNavigate();
  
  return (
    <>
      {BUTTONS.map((btn) => (
        <SidebarButton
          key={btn.id}
          icon={btn.icon}
          tooltip={btn.tooltip}
          disabled={isLoading}
          onClick={() => handleAction(btn.operation)}
        />
      ))}
      
      <hr style={{ border: "none", borderTop: "1px solid #333", margin: "8px 0", width: "100%" }} />

      <SidebarButton
        icon="🕒"
        tooltip="Storico generazioni"
        disabled={false}
        // passa nomeDocumento nello state del router — letto da historyPage via useLocation
        onClick={() => navigate("/history", { state: { nomeDocumento: docName } })}
      />
    </>
  );
};