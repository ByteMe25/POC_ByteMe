import { useEditorAI } from "../hooks/useEditorBtns";
import SidebarButton from "@/components/Sidebar/SidebarButton";

const BUTTONS = [
  { id: "summarize", icon: "📝", tooltip: "Riassumi il testo",   operation: "summary" },
  { id: "fix",       icon: "🔧", tooltip: "Correggi grammatica", operation: "fix_grammar" },
  { id: "translate", icon: "🌍", tooltip: "Traduci in inglese",  operation: "translate_en" },
];

export const EditorSidebarButtons = ({ getEditorText, insertText }) => {
  const { handleAction, isLoading } = useEditorAI({ getEditorText, insertText });

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
        onClick={() => navigate("/history", { state: { nomeDocumento } })}
      />
    </>
  );
};