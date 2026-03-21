import { useEffect, useRef, useCallback } from "react";
import { openDocumentCall } from "../api/openDocumentCall";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import { FormattingCommands } from "./FormattingCommands";

export const useEditor = (docName) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editorRef.current || !textareaRef.current) return;
    
    editorRef.current = new EasyMDE({
      element: textareaRef.current,
      sideBySideFullscreen: false,
      toolbar: [
    {
      name: "bold",
      action: FormattingCommands.bold, // Il comando concreto
      className: "fa fa-bold",
      title: "Grassetto",
    },
    {
      name: "italic",
      action: FormattingCommands.italic, // Il comando concreto
      className: "fa fa-italic",
      title: "Corsivo",
    },
    
    {
      name: "heading",
      action: FormattingCommands.heading,
      className: "fa fa-header",
      title: "Intestazioni",
    },
    "|",
    {
      name: "quote",
      action: FormattingCommands.quote,
      className: "fa fa-quote-left",
      title: "Citazione",
    },
    {
      name: "unordered-list",
      action: FormattingCommands.unorderedList,
      className: "fa fa-list-ul",
      title: "Lista Puntata",
    },
    {
      name: "ordered-list",
      action: FormattingCommands.orderedList,
      className: "fa fa-list-ol",
      title: "Lista Numerata",
    },
    "|",
    {
      name: "link",
      action: FormattingCommands.link,
      className: "fa fa-link",
      title: "Inserisci Link",
    },
    {
      name: "image",
      action: FormattingCommands.image,
      className: "fa fa-picture-o",
      title: "Inserisci Immagine",
    },
    "|",
    {
      name: "preview",
      action: FormattingCommands.togglePreview,
      className: "fa fa-eye no-disable",
      title: "Anteprima",
    },
    {
      name: "side-by-side",
      action: FormattingCommands.toggleSideBySide,
      className: "fa fa-columns no-disable no-mobile",
      title: "Vista Affiancata",
    },
    {
      name: "fullscreen",
      action: FormattingCommands.toggleFullScreen,
      className: "fa fa-arrows-alt no-disable no-mobile",
      title: "Schermo Intero",
    },
  
    ],
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