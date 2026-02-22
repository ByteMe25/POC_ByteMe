/* =========================================
   CONFIGURAZIONE EDITOR E NOTIFICHE
   ========================================= */
// Funzione Helper per Notifiche (toastify)
const notify = (msg, type = "info") => {
    let cssClass = type === "error" ? "toast-error" : "toast-success"; 
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "bottom", 
        position: "right", 
        className: "toast-base " + cssClass,
    }).showToast();
};

// Inizializzazione EasyMDE -> Interfaccia principale
const easyMDE = new EasyMDE({ 
    element: document.getElementById('my-editor'),
    spellChecker: false, 
    sideBySideFullscreen: false,
    autofocus: true,
    inputStyle: "contenteditable", 
    status: ["autosave", "lines", "words", "cursor"], 

    syncSideBySidePreviewScroll: false, //fix scroll split view
    
    toolbar: [
        "undo", "redo", "|",
        "bold", "italic",
        {
            name: "underline",
            action: function(editor){
                var cm = editor.codemirror;
                var selectedText = cm.getSelection();
                var text = selectedText || "testo"; 
                cm.replaceSelection("<u>" + text + "</u>");
            },
            className: "fa fa-underline",
            title: "Sottolineato",
        }, "|",
        "heading-smaller", "heading-bigger", "|",
        "table",
        {
            name: "horizontal-rule",
            action: function(editor) {
                const cm = editor.codemirror;
                const cursor = cm.getCursor();
                
                cm.replaceRange("\n\n---\n\n", cursor);
                cm.focus();
            },
            className: "fa fa-minus",
            title: "Insert horizontal line"
        },
        "link","|",
        "unordered-list", "ordered-list", "|",
        {
            name: "copy",
            action: function(editor){
                var txt = editor.codemirror.getSelection(); 
                if(!txt) return notify("Seleziona del testo prima!", "error");
                navigator.clipboard.writeText(txt)
                .then(() => notify("Copiato negli appunti!"))
                .catch(e => notify("Errore copia browser", "error"));
            },
            className: "fa fa-copy", 
            title: "Copy (Ctrl+C)"
        },
        {
            name: "paste",
            action: function(editor){
                navigator.clipboard.readText()
                .then(t => editor.codemirror.replaceSelection(t))
                .catch(e => notify("Usa CTRL+V per incollare", "error"));
            },
            className: "fa fa-paste",
            title: "Paste (Ctrl+V)"
        },
        {
            name: "cut",
            action: function(editor){
                var cm = editor.codemirror; 
                var txt = cm.getSelection();
                if(!txt) return notify("Seleziona del testo!", "error");
                navigator.clipboard.writeText(txt).then(() => {
                    cm.replaceSelection("");
                    notify("Testo tagliato!"); 
                });
            },
            className: "fa fa-scissors",
            title: "Cut (Ctrl+Z)"
        },
        "|",
        {
            name: "editor-only",
            action: showEditorOnly,
            className: "fa fa-pen",
            title: "Only editor view"
        },
        {
            name: "preview-only",
            action: showPreviewOnly,
            className: "fa fa-eye",
            title: "Only document view"
        },
        {
            name: "side-by-side",
            action: showSideBySide,
            className: "fa fa-columns",
            title: "Editor and document view"
        },],

        //configurazione per gestire meglio l'anteprima
    previewRender: function(plainText) {
        return easyMDE.markdown(plainText); //per rendering anteprima
    }

});

// Funzione per evidenziare i pulsanti attivi della toolbar
function updateToolbarButtons() {
    //rimuovi tutte le classi active
    document.querySelectorAll('.editor-toolbar button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (easyMDE.isPreviewActive() && !easyMDE.isSideBySideActive()) {
        document.querySelector('.editor-toolbar button[title="Only document view"]').classList.add('active');
    } else if (easyMDE.isSideBySideActive()) {
        document.querySelector('.editor-toolbar button[title="Editor and document view"]').classList.add('active');
    } else {
        document.querySelector('.editor-toolbar button[title="Only editor view"]').classList.add('active');
    }
}

function showEditorOnly() {
    if (easyMDE.isPreviewActive()) easyMDE.togglePreview();
    if (easyMDE.isSideBySideActive()) easyMDE.toggleSideBySide();
    highlightActiveButton('editor-only');
}

function showPreviewOnly() {
    if (easyMDE.isSideBySideActive()) easyMDE.toggleSideBySide();
    if (!easyMDE.isPreviewActive()) easyMDE.togglePreview();
    highlightActiveButton('preview-only');
}

function showSideBySide() {
    if (easyMDE.isPreviewActive()) easyMDE.togglePreview();
    if (!easyMDE.isSideBySideActive()) easyMDE.toggleSideBySide();
    highlightActiveButton('side-by-side');
}

//pulsante attivo (quale vista è attiva)
function highlightActiveButton(activeMode) {
    document.querySelectorAll('.editor-toolbar button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (activeMode === 'editor-only') {
        document.querySelector('.editor-toolbar button[title="Only editor view"]')?.classList.add('active');
    } else if (activeMode === 'preview-only') {
        document.querySelector('.editor-toolbar button[title="Only document view"]')?.classList.add('active');
    } else if (activeMode === 'side-by-side') {
        document.querySelector('.editor-toolbar button[title="Editor and document view"]')?.classList.add('active');
    }
}


/* =========================================
   GESTIONE UI (SIDEBAR & ACCORDION) 
   ========================================= */
// Apre/Chiude il pannello laterale (chiamato dall'icona stelline)
function toggleSidePanel(panelId) {
    const panel = document.getElementById('side-panel');

    //rimuove active-tab da tutte le icone
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.remove('active-tab');
    });
    
    //aggiungi active-tab solo all'icona cliccata
    event.currentTarget.classList.add('active-tab');
    
    //logica inversa: se ha la classe 'closed', lo apriamo rimuovendola
    if (panel.classList.contains('closed')) {
        panel.classList.remove('closed'); 
        
        //ridisegna l'editor dopo l'animazione CSS per adattare la larghezza
        setTimeout(() => {
            easyMDE.codemirror.refresh();
        }, 300);
        
    } else {
        panel.classList.add('closed');
    }
}

//chiude forzatamente il pannello (tasto X)
function closeSidePanel() {
    document.getElementById('side-panel').classList.add('closed');

    //rimuovi active-tab da tutte le icone
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.remove('active-tab');
    });
}

// Gestione Accordion (apre/chiude sottomenu Cappelli e Lingue)
function toggleAccordion(id) {
    const body = document.getElementById(id);
    const wasOpen = body.classList.contains('open');
    
    // Opzionale: chiude gli altri accordion aperti per tenere ordine
    document.querySelectorAll('.accordion-body').forEach(el => el.classList.remove('open'));
    
    if (!wasOpen) {
        body.classList.add('open');
    }
}


/* =========================================
   LOGICA INTELLIGENZA ARTIFICIALE
   ========================================= */
let activeWidget = null;
let activeWidgetElement = null;
let currentOperation = "";
let currentTextContext = "";
let generationHistory = []; //storico di tutte le generazioni

// Funzione principale chiamata dai bottoni della Sidebar
async function callAI(operation) {
    //se è nella sezione dello storico non si possono usare funzioni AI
    const historyView = document.getElementById('history-view');
    if (historyView && historyView.classList.contains('active')) {
        notify("Torna all'editor per usare le funzioni AI", "error");
        return;
    }

    removeAiWidget(); 

    const cm = easyMDE.codemirror;
    let text = cm.getSelection();

    //salva la posizione finale della selezione (o cursore se nessuna selezione)
    const selectionEnd = cm.getCursor("to"); // "to" = fine della selezione

    //se non seleziona nulla, prende tutto
    if (!text) text = easyMDE.value(); 

    if (!text || text.trim() === "") {
        notify("L'editor è vuoto! Scrivi qualcosa prima.", "error");
        return;
    }

    currentOperation = operation;
    currentTextContext = text;

    //passa la posizione finale al widget
    createWidgetUI(operation, "Sto elaborando...", true, selectionEnd);
    
    performApiCall(text, operation);
}

// Chiamata API
async function performApiCall(text, operation) {
    try {
        const response = await fetch("http://localhost:8000/api/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, operation: operation })
        });

        const data = await response.json();
        updateWidgetContent(data.generated_text);
        
    } catch (err) {
        console.error(err);
        updateWidgetContent("Errore: Impossibile contattare l'IA.");
        notify("Errore generazione", "error");
    }
}


/* =========================================
   INTERFACCIA WIDGET (DOM)
   ========================================= */
function createWidgetUI (operation, initialText, isLoading = false, cursorPosition = null){
    const cm = easyMDE.codemirror;
    const now = new Date();
    const timeString = now.toLocaleDateString('it-IT') + ' ' + now.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
    
    //usa la posizione passata o prende quella corrente
    const cursor = cursorPosition || cm.getCursor("to");

    // Titolo e Nome Operazione
    let opName = "AI Assistant";
    
    if (operation === 'summary') opName = "Riassunto";
    else if (operation === 'distant_writing') opName = "Distant Writing";
    else if (operation === 'fix_grammar') opName = "Correzione Grammaticale";
    else if (operation === 'rewrite') opName = "Riscrittura";
    else if (operation === 'chart') opName = "Grafico"; //DA FARE
    else if (operation.includes('hat')) {
        //traduzione manuale dei colori per avere un titolo in Italiano corretto
        const colorMap = {
            'white': 'Bianco', 'red': 'Rosso', 'black': 'Nero',
            'yellow': 'Giallo', 'green': 'Verde', 'blue': 'Blu'
        };
        const colorKey = operation.split('_')[0]; // es: "red"
        opName = "Cappello " + (colorMap[colorKey] || colorKey.toUpperCase());
    }
    else if (operation.includes('translate')) {
        opName = "Traduzione " + operation.split('_')[1].toUpperCase();
    }

    const headerTitle = `// Generato: ${opName} - ${timeString}`;

    // Creazione Contenitore
    const container = document.createElement("div");
    container.className = "ai-widget-container"; 
    
    // Classi per i Cappelli (x sfondi colorati)
    if (operation.includes("_hat")) { // Es: "green_hat" diventa classe "ai-mode-green"
        const colorMode = operation.split('_')[0]; 
        container.classList.add(`ai-mode-${colorMode}`);
    }

    // HTML Interno
    container.innerHTML = `
        <div class="ai-widget-header">
            <span id="ai-widget-title">${headerTitle}</span>
            <i class="fa fa-robot"></i>
        </div>
        
        <div id="ai-widget-body" class="ai-widget-content ${isLoading ? 'ai-loading' : ''}">
            ${initialText}
        </div>
        
        <div class="ai-widget-actions">
            <button class="action-btn btn-delete" onclick="removeAiWidget()">
                <i class="fa fa-trash"></i> Elimina
            </button>
            <button class="action-btn" onclick="regenerateAi()">
                Rigenera ↻
            </button>
            <button class="action-btn" onclick="confirmAiInsert()">
                Conferma ✅
            </button>
        </div>
    `;

    activeWidgetElement = container;

    //salva la posizione del cursore per usarla in confirmAiInsert
    widgetCursorPosition = { line: cursor.line, ch: cursor.ch };

    //crea il widget e lo posiziona dopo la riga corrente: addLineWidget aggiunge DOPO la riga specificata
    activeWidget = cm.addLineWidget(cursor.line, container, { 
        coverGutter: false, 
        noHScroll: true
    });

    //scrollIntoView causa problemi con CodeMirror; usa il sistema di scroll interno di CodeMirror
    cm.scrollIntoView({
        from: { line: cursor.line, ch: 0 },
        to: { line: cursor.line + 1, ch: 0 }
    }, 200); // 200ms per un'animazione smooth
    
    //refresh per garantire che il rendering sia corretto
    setTimeout(() => {
        cm.refresh();
    }, 100);
}


function updateWidgetContent(newText) {
    if (!activeWidgetElement) return;
    const body = activeWidgetElement.querySelector("#ai-widget-body");
    body.innerText = newText;
    body.classList.remove("ai-loading");

    saveToHistory(currentOperation, newText); //salva nello storico
}

// AZIONI WIDGET
function removeAiWidget() {
    if (activeWidget) {
        activeWidget.clear();
        activeWidget = null;
        activeWidgetElement = null;
        widgetCursorPosition = null; //pulisce anche la posizione salvata
    }
}

function regenerateAi() {
    if (!activeWidgetElement) return;
    const body = activeWidgetElement.querySelector("#ai-widget-body");
    body.innerText = "Rielaborazione in corso...";
    body.classList.add("ai-loading");
    performApiCall(currentTextContext, currentOperation);
}

function confirmAiInsert() {
    if (!activeWidgetElement || !widgetCursorPosition){
        notify("Errore: widget non trovato", "error");
        return;
    }

    const body = activeWidgetElement.querySelector("#ai-widget-body");
    const titleElement = activeWidgetElement.querySelector("#ai-widget-title");
    const finalText = body.innerText;

    if (!finalText || finalText.trim() === "" || finalText.includes("Errore:")) {
        notify("Nessun contenuto valido da inserire", "error");
        return;
    }
    
    const cm = easyMDE.codemirror;

    //salva la posizione PRIMA di rimuovere il widget
    const insertLine = widgetCursorPosition.line + 1; //inserisci dopo la riga del cursore originale

    //rimuove il widget
    const widgetLine = activeWidget.line;
    removeAiWidget();

    //inserisce il testo nella posizione dove era il widget
    const separator = "\n---\n";
    const titleText = titleElement ? titleElement.innerText : "Generato da AI";
    const textToInsert = `\n${separator}\`${titleText}\`\n\n${finalText}\n${separator}\n`;

    //inserisce il testo alla posizione salvata
    cm.replaceRange(textToInsert, { line: insertLine, ch: 0 });

    //sposta il cursore alla fine del testo inserito
    const newLines = textToInsert.split('\n').length;
    cm.setCursor({ line: insertLine + newLines - 1, ch: 0 });
    
    //focus sull'editor
    cm.focus();
    
    notify("✅ Contenuto inserito correttamente!");
}


/* =========================================
   FILE SYSTEM & DB (Salvataggio, Caricamento, Test)
   ========================================= */
// GESTIONE STORIA GENERAZIONI
function saveToHistory(operation, generatedText) {
    const now = new Date();
    const timeString = now.toLocaleDateString('it-IT') + ' ' + now.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit', second: '2-digit'});
    
    let opName = "AI Assistant";
    if (operation === 'summary') opName = "Riassunto";
    else if (operation === 'distant_writing') opName = "Distant Writing";
    else if (operation === 'fix_grammar') opName = "Correzione Grammaticale";
    else if (operation === 'rewrite') opName = "Riscrittura";
    else if (operation === 'chart') opName = "Grafico";
    else if (operation.includes('hat')) {
        const colorMap = {
            'white': 'Bianco', 'red': 'Rosso', 'black': 'Nero',
            'yellow': 'Giallo', 'green': 'Verde', 'blue': 'Blu'
        };
        const colorKey = operation.split('_')[0];
        opName = "Cappello " + (colorMap[colorKey] || colorKey.toUpperCase());
    }
    else if (operation.includes('translate')) {
        opName = "Traduzione " + operation.split('_')[1].toUpperCase();
    }
    
    const historyItem = {
        id: Date.now(),
        operation: operation,
        operationName: opName,
        text: generatedText,
        timestamp: now.toISOString(),
        displayTime: timeString
    };
    
    generationHistory.unshift(historyItem); //aggiunge all'inizio (più recente prima)
    
    //salva in localStorage per persistenza
    try {
        localStorage.setItem('ai_generation_history', JSON.stringify(generationHistory));
    } catch (e) {
        console.warn("Impossibile salvare la storia in localStorage:", e);
    }
}

function loadHistoryFromStorage() {
    try {
        const stored = localStorage.getItem('ai_generation_history');
        if (stored) {
            generationHistory = JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Impossibile caricare la storia da localStorage:", e);
        generationHistory = [];
    }
}

function toggleHistoryView() {
    const editorView = document.getElementById('editor-view');
    const historyView = document.getElementById('history-view');

    //chiude pannello laterale quando cambia vista
    closeSidePanel();
    
    if (historyView.classList.contains('active')) {
        //torna all'editor
        historyView.classList.remove('active');
        editorView.classList.remove('hidden');
        //refresh dell'editor dopo il cambio vista
        setTimeout(() => {
            easyMDE.codemirror.refresh();
        }, 100);
    } else {
        //vai alla storia
        editorView.classList.add('hidden');
        historyView.classList.add('active');
        renderHistory();
    }
}

function renderHistory() {
    const container = document.getElementById('history-content');
    //storia vuota
    if (generationHistory.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                <i class="fa fa-robot"></i>
                <p>Nessuna generazione salvata ancora.</p>
                <p>Le tue generazioni AI appariranno qui.</p>
            </div>
        `;
        return;
    }
    //card delle generazioni
    let html = '';
    generationHistory.forEach(item => {
        html += `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-item-title">${item.operationName}</span>
                    <span class="history-item-date">${item.displayTime}</span>
                </div>
                <div class="history-item-content">${item.text}</div>
                <div class="history-item-actions">
                    <button class="btn-copy" onclick="copyHistoryItem(${item.id})">
                        <i class="fa fa-copy"></i>
                        Copia Testo
                    </button>

                    <button class="btn-delete-history" onclick="deleteHistoryItem(${item.id})">
                        <i class="fa fa-trash"></i>
                        Elimina
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

//l'utente può copiare il testo di una generazione dallo storico (unica azione che può fare oltre a eliminarla)
function copyHistoryItem(itemId) {
    const item = generationHistory.find(h => h.id === itemId);
    if (!item) {
        notify("Elemento non trovato", "error");
        return;
    }
    
    navigator.clipboard.writeText(item.text)
        .then(() => notify("📋 Testo copiato negli appunti!"))
        .catch(e => {
            notify("Errore durante la copia", "error");
            console.error(e);
        });
}

function deleteHistoryItem(itemId) {
    // Trova l'indice dell'elemento
    const index = generationHistory.findIndex(h => h.id === itemId);
    
    if (index === -1) {
        notify("Elemento non trovato", "error");
        return;
    }
    
    // Rimuove dall'array
    generationHistory.splice(index, 1);
    
    // Aggiorna localStorage
    try {
        localStorage.setItem('ai_generation_history', JSON.stringify(generationHistory));
    } catch (e) {
        console.warn("Impossibile aggiornare localStorage:", e);
    }
    
    // Animazione di rimozione della card
    const card = document.querySelector(`.history-item[data-id="${itemId}"]`);
    if (card) {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            renderHistory(); // Re-renderizza la lista
            notify("🗑️ Generazione eliminata");
        }, 300);
    } else {
        renderHistory();
        notify("🗑️ Generazione eliminata");
    }
}

//carica lo storico all'avvio
loadHistoryFromStorage();


// TEST CONNESSIONE DB (con pallino colorato)
async function testConnection() {
    const statusDot = document.getElementById('db-status');
    try {
        const response = await fetch("http://localhost:8000/api/test-db-connection");
        const data = await response.json();
        if(data.status === "success") {
            notify(data.message);
        } else {
            notify("Errore nel database", "error");
        }
    } catch (e) {
        notify("Backend non raggiungibile", "error");
    }
}

// SCARICA FILE
async function downloadFile() {
    closeSidePanel(); //chiude pannello laterale

    var testo = easyMDE.value();
    if(testo.trim() === "") {
        notify("Il documento è vuoto!", "error");
        return;
    }
    var titolo = document.getElementById('doc-title').value || "nota-senza-nome";
    titolo = titolo.replace(/[^a-z0-9\s-_]/gi, '_').trim();
    
    var blob = new Blob([testo], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = titolo + ".md"; 
    a.click();
    URL.revokeObjectURL(url);
    
    notify("File salvato: " + titolo + ".md");
    const isLogged = document.getElementById('user-email').style.display !== 'none';
    
    if (isLogged) {
        await saveToDatabase(titolo, testo);
    } else {
        notify("Loggati per salvare anche nel tuo profilo!", "info");
    }
}

//salva nel db il documento
async function saveToDatabase(titolo, contenuto) {
    try {
        const response = await fetch(`${API_URL}/save-document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: titolo,
                contenuto: contenuto
            }),
            credentials: "include" // Importante per la sessione utente
        });

        const data = await response.json();

        if (response.ok) {
            notify("☁️ Sincronizzato nel profilo!");
        } else {
            console.error("Errore DB:", data.error);
            notify("Errore sincronizzazione cloud", "error");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
        notify("Impossibile connettersi al database", "error");
    }
}


// CARICA FILE (Trigger Input nascosto)
function triggerUpload() {
    closeSidePanel(); //chiude pannello laterale

    const fileInput = document.getElementById('file-input');
    if(fileInput) {
        fileInput.click();
    } else {
        notify("Errore: Input file non trovato", "error");
    }
}

// EVENTO CARICAMENTO REALE
const fileInputElement = document.getElementById('file-input');
if (fileInputElement) {
    fileInputElement.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            easyMDE.value(e.target.result);
            let nomeFile = file.name.replace(/\.[^/.]+$/, "");
            document.getElementById('doc-title').value = nomeFile;
            notify("File caricato: " + file.name);
            event.target.value = ''; 
        };
        reader.readAsText(file);
    });
}


// INIZIALIZZAZIONE VISTA DI DEFAULT (side-by-side)
document.addEventListener('DOMContentLoaded', function() {
    // Imposta split view di default con un piccolo delay
    setTimeout(() => {
        showSideBySide();
    }, 100);
});

// GESTIONE VISTE PER UTENTI LOGGATI E NON
const API_URL = "http://localhost:8000/api";

// --- FUNZIONE LOGOUT ---
async function logoutUtente() {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Logout effettuato!", data);
            //alert("Logout eseguito con successo.");
            // Qui potresti reindirizzare l'utente alla pagina di login:
            window.location.href = "index.html";
        } else {
            console.error("❌ Logout fallito:", data.errore);
            alert("Errore durante il logout!");
        }
    }
    catch (error) {
        console.error("❌ Errore di connessione:", error);
        alert("Errore di connessione durante il logout.");
    }
}


const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const userEmailElement = document.getElementById('user-email');
const logoutButton = document.querySelector('.logout-btn');

userEmailElement.style.display = 'none';
logoutButton.style.display = 'none';

async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/check-auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok && data.authenticated) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            userEmailElement.style.display = 'block';
            logoutButton.style.display = 'block';
            userEmailElement.innerText = data.email || "Utente";
        } else {
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            userEmailElement.style.display = 'none';
            logoutButton.style.display = 'none';
        }
    } catch (error) {
        console.error(error);
        alert("Errore di connessione.");
        loginLink.style.display = 'block'; 
        registerLink.style.display = 'block';
        userEmailElement.style.display = 'none';
        logoutButton.style.display = 'none';
    }
}

addEventListener('DOMContentLoaded', checkAuthStatus);

async function apriDocumento() {
    const docToOpen = localStorage.getItem("openedDocument");
    if (docToOpen) {
        const doc = JSON.parse(docToOpen);
        easyMDE.value(doc.contenuto);
        document.getElementById('doc-title').value = doc.nome.replace(/\.[^/.]+$/, "");
        localStorage.removeItem("openedDocument"); 
    }
    else{ }
}

addEventListener('DOMContentLoaded', apriDocumento);