// EditorCommands.js

export const EditorCommands = {
  // --- Azione: Upload Locale ---
  upload_local: async ({ insertText }) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    
    return new Promise((resolve) => {
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return resolve();
        
        const reader = new FileReader();
        reader.onload = (event) => {
          insertText(event.target.result);
          resolve();
        };
        reader.readAsText(file);
      };
      input.click();
    });
  },

  // --- Azione: Salva su DB ---
  save_db: async ({ getEditorText }) => {
    const text = getEditorText();
    const docName = prompt("Inserisci un titolo per il documento:");
    
    if (!docName || !text) return;

    const response = await fetch("/api/save-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nome: docName, contenuto: text }),
    });

    const data = await response.json();
    if (data.status !== "success") throw new Error(data.message);
    alert("Ottimo! Documento salvato.");
  },

  // --- Azione: Generica AI (es: riassunto, correzione, etc) ---
  ai_operation: async ({ operation, getEditorText, insertText, callAI, saveToHistory }) => {
    const text = getEditorText();
    const result = await callAI(text, operation);
    insertText(result);
    
    // Passiamo i dati alla funzione di callback per lo storico
    await saveToHistory(text, result);
  }
};