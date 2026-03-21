// FormattingCommands.js
export const FormattingCommands = {
  bold: (mde) => {
    const cm = mde.codemirror; // Accediamo al "motore" del testo
    const selection = cm.getSelection();
    if (selection) {
      cm.replaceSelection(`**${selection}**`);
    } else {
      const cursor = cm.getCursor();
      cm.replaceRange("****", cursor);
      cm.setCursor(cursor.line, cursor.ch + 2); // Mette il cursore in mezzo agli asterischi
    }
    cm.focus();
  },
  
  italic: (mde) => {
    const cm = mde.codemirror;
    const selection = cm.getSelection();
    cm.replaceSelection(`*${selection || "testo"}*`);
    cm.focus();
  },
  //per praticità uso direttamente le funzioni di easyMDE

  heading: (mde) => mde.toggleHeading1(),

  quote: (mde) => mde.toggleBlockquote(),

  // --- Liste ---
  unorderedList: (mde) => mde.toggleUnorderedList(),
  
  orderedList: (mde) => mde.toggleOrderedList(),

  // --- Inserimenti ---
  link: (mde) => mde.drawLink(),

  image: (mde) => mde.drawImage(),

  // --- Azioni Editor (Toggle UI) ---
  togglePreview: (mde) => mde.togglePreview(),

  toggleSideBySide: (mde) => mde.toggleSideBySide(),

  toggleFullScreen: (mde) => mde.toggleFullScreen(),

  undo: (mde) => mde.undo(),
  redo: (mde) => mde.redo(),

  
};