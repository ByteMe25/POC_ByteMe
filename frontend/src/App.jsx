import { useEffect, useRef } from "react";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import TopBar from "./components/TopBar";
import styles from "./App.module.css";
import Sidebar from "./components/Sidebar";

export default function App() {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

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

  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.body}>
        <Sidebar
          getEditorText={() => editorRef.current?.value() ?? ""}
          insertText={(text) => {
            const cm = editorRef.current?.codemirror;
            if (!cm) return;
            const cursor = cm.getCursor();
            cm.replaceRange("\n" + text, cursor);
          }}
        />
        <div className={styles.editor}>
          <textarea ref={textareaRef} />
        </div>
      </div>
    </div>
  );
}