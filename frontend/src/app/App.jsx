import { useEditor } from "../hooks/useEditor";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import styles from "./App.module.css";

export const App = () => {
  const { editorRef, textareaRef } = useEditor();
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.body}>
        <Sidebar
          getEditorText={() => editorRef.current?.value() ?? ""}
          insertText={(text) => {
            const cm = editorRef.current?.codemirror;
            if (!cm) return;
            cm.replaceRange("\n" + text, cm.getCursor());
          }}
        />
        <div className={styles.editor}>
          <textarea ref={textareaRef} />
        </div>
      </div>
    </div>
  );
}