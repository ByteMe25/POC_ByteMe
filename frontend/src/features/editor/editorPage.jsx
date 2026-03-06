import TopBar from "../../components/TopBar";
import Sidebar from "../../components/Sidebar";
import { useEditor } from "./hooks/useEditor";      
import styles from "./EditorPage.module.css";

export const EditorPage = () => {
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