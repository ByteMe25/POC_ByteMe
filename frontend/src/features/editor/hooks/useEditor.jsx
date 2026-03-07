import { useEffect, useRef } from "react";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

export const useEditor = () => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

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

  const getEditorText = () => editorRef.current?.value() ?? "";

  const insertText = (text) => {
    const cm = editorRef.current?.codemirror;
    if (!cm) return;
    cm.replaceRange("\n" + text, cm.getCursor());
  };

  return { editorRef, textareaRef, getEditorText, insertText };
};