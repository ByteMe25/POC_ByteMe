
type EditorCommand = (mde: EasyMDE) => void;

export const FormattingCommands: Record<string, EditorCommand> = {
  bold: (mde) => {
    const cm = mde.codemirror; 
    // TypeScript ora sa che 'cm' ha il metodo getSelection()
    const selection = cm.getSelection();
    if (selection) {
      cm.replaceSelection(`**${selection}**`);
    } else {
      const cursor = cm.getCursor();
      cm.replaceRange("****", cursor);
      cm.setCursor(cursor.line, cursor.ch + 2);
    }
    cm.focus();
  },

  italic: (mde) => {
    const cm = mde.codemirror;
    const selection = cm.getSelection();
    cm.replaceSelection(`*${selection || "testo"}*`);
    cm.focus();
  },

  heading: (mde) => mde.toggleHeading1(),

  quote: (mde) => mde.toggleBlockquote(),

  unorderedList: (mde) => mde.toggleUnorderedList(),
  
  orderedList: (mde) => mde.toggleOrderedList(),

  link: (mde) => mde.drawLink(),

  image: (mde) => mde.drawImage(),

  togglePreview: (mde) => mde.togglePreview(),

  toggleSideBySide: (mde) => mde.toggleSideBySide(),

  toggleFullScreen: (mde) => mde.toggleFullScreen(),

  undo: (mde) => mde.undo(),

  redo: (mde) => mde.redo(),
};