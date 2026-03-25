import { useState, useCallback, useRef, useEffect } from "react";
import { useDocName } from "./../../context/openedDocContext";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { EditorSidebarButtons } from "./components/EditorSidebarButtons";
import { AiWidget } from "./aiWidget/AiWidget";
import TopBar from "@/components/Topbar/TopBar";
import { useEditor } from "./hooks/useEditor";
import styles from "./EditorPage.module.css";

export const EditorPage = () => {
  const { docName } = useDocName();
  const { textareaRef, getEditorText, insertTextAtCursor, insertWidget } = useEditor(docName);
  const removeWidgetRef = useRef(null);

  const [aiWidget, setAiWidget] = useState({
    widgetState: { status: "idle" },
    confirmInsert: null,
    reset: null,
  });

  const handleAiStateChange = useCallback((state) => {
    setAiWidget(state);
  }, []);

  useEffect(() => {
    const { widgetState, confirmInsert, reset } = aiWidget;

    if (widgetState.status === "idle") {
      // rimuove il widget dal DOM quando torna idle
      removeWidgetRef.current?.();
      removeWidgetRef.current = null;
      return;
    }

    // monta o aggiorna il widget nel flusso del testo
    removeWidgetRef.current = insertWidget(
      <AiWidget
        widgetState={widgetState}
        onInsert={confirmInsert}
        onClose={reset}
      />
    );
  }, [aiWidget]);

  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.body}>
        <Sidebar>
          <EditorSidebarButtons
            getEditorText={getEditorText}
            insertText={insertTextAtCursor}
            onAiStateChange={handleAiStateChange}
          />
        </Sidebar>

        <div className={styles.editor} style={{ position: "relative" }}>
          <textarea ref={textareaRef} />
        </div>
      </div>
    </div>
  );
};