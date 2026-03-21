import { FormattingCommands } from "./FormattingCommands";


describe('Test dei Comandi di Formattazione', () => {
  
  // Test Caso 1: L'utente ha selezionato del testo
  test('Grassetto: dovrebbe aggiungere ** intorno alla selezione', () => {
    // 1. Prepariamo un finto CodeMirror
    const mockCM = {
      getSelection: jest.fn().mockReturnValue('testo'), // Simula selezione di "testo"
      replaceSelection: jest.fn(),                    // Spia cosa viene inserito
      focus: jest.fn()
    };
    
    // 2. Eseguiamo il comando passandogli il finto editor
    FormattingCommands.bold({ codemirror: mockCM });

    // 3. Verifichiamo che abbia chiamato la funzione corretta con i simboli del grassetto
    expect(mockCM.replaceSelection).toHaveBeenCalledWith('**testo**');
    expect(mockCM.focus).toHaveBeenCalled();
  });

  // Test Caso 2: L'utente NON ha selezionato nulla (cursore vuoto)
  test('Grassetto: se non c\'è selezione, inserisce **** e sposta il cursore', () => {
    const mockCM = {
      getSelection: jest.fn().mockReturnValue(''), // Selezione vuota
      getCursor: jest.fn().mockReturnValue({ line: 0, ch: 5 }),
      replaceRange: jest.fn(),
      setCursor: jest.fn(),
      focus: jest.fn()
    };

    FormattingCommands.bold({ codemirror: mockCM });

    // Verifica che abbia inserito i simboli base
    expect(mockCM.replaceRange).toHaveBeenCalledWith('****', { line: 0, ch: 5 });
    // Verifica che il cursore sia finito in mezzo (posizione 5 + 2 = 7)
    expect(mockCM.setCursor).toHaveBeenCalledWith(0, 7);
  });

});