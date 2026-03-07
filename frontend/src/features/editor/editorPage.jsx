import { Sidebar } from "@/components/Sidebar/Sidebar";
import { EditorSidebarButtons } from "./components/EditorSidebarButtons";
import TopBar from "@/components/Topbar/TopBar";
import { useEditor } from "./hooks/useEditor";
import styles from "./EditorPage.module.css";

export const EditorPage = () => {
  const { editorRef, textareaRef, getEditorText, insertText } = useEditor();

  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.body}>
        <Sidebar>
          <EditorSidebarButtons
            getEditorText={getEditorText}
            insertText={insertText}
          />
        </Sidebar>
        <div className={styles.editor}>
          <textarea ref={textareaRef} />
        </div>
      </div>
    </div>
  );
};