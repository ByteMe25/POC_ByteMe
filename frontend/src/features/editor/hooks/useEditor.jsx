import { useEffect, useRef, useCallback } from "react";
import { openDocumentCall } from "../api/openDocumentCall";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";


export const useEditor = (docName) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editorRef.current || !textareaRef.current) return;
    
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

  useEffect(() => {
    if (!editorRef.current || !docName) return;

    const loadDoc = async () => {
      try {
        const docInfo = await openDocumentCall(docName);
        if (docInfo?.document?.contenuto) {
          editorRef.current.value(docInfo.document.contenuto);
        }
      } catch (error) {
        console.error("Failed to load document:", error);
      }
    };

    loadDoc();
  }, [docName]);

  const getEditorText = useCallback(
    () => editorRef.current?.value() ?? "",
    []
  );

  const insertText = useCallback((text) => {
    const cm = editorRef.current?.codemirror;
    if (!cm) return;
    cm.replaceRange("\n" + text, cm.getCursor());
  }, []);

  return { editorRef, textareaRef, getEditorText, insertText };
};