import { useEffect, useRef, useCallback } from "react";
import { openDocumentCall } from "../api/openDocumentCall";
import { easyMDEAdapter } from "../adapters/editor.adapter"

export const useEditor = (docName) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editorRef.current || !textareaRef.current) return;
    
    editorRef.current = new easyMDEAdapter({
      element: textareaRef.current,
      sideBySideFullscreen: false,
      initialValue: "",
    });

    editorRef.current.enableSideBySide();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current || !docName) return;

    const loadDoc = async () => {
      try {
        const docInfo = await openDocumentCall(docName);
        if (docInfo?.document?.contenuto) {
          editorRef.current.setContent(docInfo.document.contenuto);
        }
      } catch (error) {
        console.error("Failed to load document:", error);
      }
    };

    loadDoc();
  }, [docName]);

  const getEditorText = useCallback(
    () => editorRef.current?.getEditorText() ?? "",
    []
  );

  const insertTextAtCursor = useCallback((text) => {
    editorRef.current.insertTextAtCursorPosition(text);
  }, []);

  return { editorRef, textareaRef, getEditorText, insertTextAtCursor };
};