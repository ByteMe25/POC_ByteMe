import { useEffect, useRef, useState, useCallback } from "react";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import HistoryView from "./components/HistoryView";
import { useAiHistory } from "./hooks/useAiHistory";
import styles from "./App.module.css";

export default function App() {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  // Gestione della vista corrente: "editor" o "history"
  // È uno stato semplice, non serve un router per due viste
  const [currentView, setCurrentView] = useState("editor");

  const { history, addEntry, removeEntry } = useAiHistory();

  useEffect(() => {
    if (editorRef.current) return;
    editorRef.current = new EasyMDE({
      element: textareaRef.current,
      sideBySideFullscreen: false,
      initialValue: "",
    });
    editorRef.current.toggleSideBySide();
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, []);

  const insertText = useCallback((text) => {
    const cm = editorRef.current?.codemirror;
    if (!cm) return;
    const cursor = cm.getCursor();
    cm.replaceRange("\n" + text, cursor);
  }, []);

  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.body}>
        {/* La Sidebar è sempre visibile in entrambe le viste */}
        <Sidebar
          getEditorText={() => editorRef.current?.value() ?? ""}
          insertText={insertText}
          onResult={addEntry}
          onNavigateHistory={() => setCurrentView("history")}
        />

        {/* Rendering condizionale della vista */}
        {currentView === "editor" ? (
          <div className={styles.editor}>
            <textarea ref={textareaRef} />
          </div>
        ) : (
          <HistoryView
            history={history}
            onDelete={removeEntry}
            onBack={() => setCurrentView("editor")}
          />
        )}

      </div>
    </div>
  );
}