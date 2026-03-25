import { useEffect, useRef, useCallback } from "react";
import { openDocumentCall } from "../api/openDocumentCall";
import { EasyMDEAdapter } from "../adapters/editor.adapterTS"
import { easyMDEAdapter } from "../adapters/editor.adapter"

import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";

export const useEditor = (docName) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const widgetHandleRef = useRef(null); // handle CodeMirror per rimuovere il widget
  const widgetRootRef = useRef(null);   // root React per smontare il componente

  useEffect(() => {
    if (editorRef.current || !textareaRef.current) return;
    
    editorRef.current = new EasyMDEAdapter({
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

  /**
   * Monta un componente React nel flusso del testo di CodeMirror,
   * dopo la riga del cursore o della selezione corrente.
   * Ritorna una funzione `remove` per smontarlo.
   */
  const insertWidget = useCallback((reactNode) => {
    // Rimuove un eventuale widget precedente
    if (widgetHandleRef.current) {
      widgetHandleRef.current.clear();
      widgetHandleRef.current = null;
    }
    if (widgetRootRef.current) {
      widgetRootRef.current.unmount();
      widgetRootRef.current = null;
    }

    const container = document.createElement("div");
    widgetHandleRef.current = editorRef.current.addLineWidget(container);

    const root = createRoot(container);
    widgetRootRef.current = root;
    root.render(reactNode);

    // Ritorna una funzione per rimuovere il widget dall'esterno (es. onClose)
    return () => {
      widgetHandleRef.current?.clear();
      widgetHandleRef.current = null;
      widgetRootRef.current?.unmount();
      widgetRootRef.current = null;
    };
  }, []);

  return { editorRef, textareaRef, getEditorText, insertTextAtCursor, insertWidget };
};