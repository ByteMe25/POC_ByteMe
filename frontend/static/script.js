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
    
    // LA TUA TOOLBAR (Non modificata)
    toolbar: [
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
        "code", "table", "link", "image", "|",
        "undo", "redo", "|",
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
        "side-by-side", 
        "fullscreen", 
        "guide", 
    ] 
});

easyMDE.toggleSideBySide(); // Anteprima attiva subito


/* =========================================
   GESTIONE UI (SIDEBAR & ACCORDION) 
   ========================================= */
// Apre/Chiude il pannello laterale (chiamato dall'icona stelline)
function toggleSidePanel(panelId) {
    const panel = document.getElementById('side-panel');
    
    // Logica inversa: se ha la classe 'closed', lo apriamo rimuovendola
    if (panel.classList.contains('closed')) {
        panel.classList.remove('closed'); 
        
        // Trucco: ridisegna l'editor dopo l'animazione CSS per adattare la larghezza
        setTimeout(() => {
            easyMDE.codemirror.refresh();
        }, 300);
        
    } else {
        panel.classList.add('closed');
    }
}

// Chiude forzatamente il pannello (tasto X)
function closeSidePanel() {
    document.getElementById('side-panel').classList.add('closed');
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

// Funzione principale chiamata dai bottoni della Sidebar
async function callAI(operation) {
    removeAiWidget(); 

    const cm = easyMDE.codemirror;
    let text = cm.getSelection();

    // Se non seleziona nulla, prende tutto
    if (!text) text = easyMDE.value(); 

    if (!text || text.trim() === "") {
        notify("L'editor è vuoto! Scrivi qualcosa prima.", "error");
        return;
    }

    currentOperation = operation;
    currentTextContext = text;

    createWidgetUI(operation, "Sto elaborando...", true);
    
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
function createWidgetUI(operation, initialText, isLoading = false) {
    const cm = easyMDE.codemirror;
    const now = new Date();
    const timeString = now.toLocaleDateString('it-IT') + ' ' + now.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});
    
    // Titolo e Nome Operazione
    let opName = "AI Assistant";
    
    if (operation === 'summary') opName = "Riassunto";
    else if (operation === 'distant_writing') opName = "Distant Writing";
    else if (operation === 'fix_grammar') opName = "Correzione Grammaticale";
    else if (operation === 'rewrite') opName = "Riscrittura";
    else if (operation === 'chart') opName = "Grafico";
    else if (operation.includes('hat')) {
        // Traduzione manuale dei colori per avere un titolo in Italiano corretto
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

    // 4. HTML Interno
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
    const cursor = cm.getCursor("to");
    activeWidget = cm.addLineWidget(cursor.line, container, { 
        coverGutter: false, 
        noHScroll: true 
    });
    
    container.scrollIntoView({ behavior: "smooth", block: "center" });
}


function updateWidgetContent(newText) {
    if (!activeWidgetElement) return;
    const body = activeWidgetElement.querySelector("#ai-widget-body");
    body.innerText = newText;
    body.classList.remove("ai-loading"); 
}

// AZIONI WIDGET
function removeAiWidget() {
    if (activeWidget) {
        activeWidget.clear();
        activeWidget = null;
        activeWidgetElement = null;
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
    if (!activeWidgetElement) return;

    const body = activeWidgetElement.querySelector("#ai-widget-body");
    const titleElement = activeWidgetElement.querySelector("#ai-widget-title");
    const finalText = body.innerText;
    const titleText = titleElement ? titleElement.innerText : "// AI Generated Content"; 
    
    const cm = easyMDE.codemirror;
    const separator = "\n---\n";
    const textToInsert = `\n${separator}\`${titleText}\`\n\n${finalText}\n${separator}\n`;

    const lineNo = cm.getLineHandle(activeWidget.line).lineNo();
    cm.replaceRange(textToInsert, { line: lineNo + 1, ch: 0 });

    notify("Contenuto inserito nel documento!");
    removeAiWidget();
}


/* =========================================
   FILE SYSTEM & DB (Salvataggio, Caricamento, Test)
   ========================================= */

// TEST CONNESSIONE DB (Aggiornato con pallino colorato)
async function testConnection() {
    const statusDot = document.getElementById('db-status');
    try {
        const response = await fetch("http://localhost:8000/api/test-db-connection");
        const data = await response.json();
        
        if(data.status === "success") {
            notify(data.message);
            statusDot.style.color = "#2ecc71"; // Verde
        } else {
            notify("Errore DB: " + data.detail, "error");
            statusDot.style.color = "#e74c3c"; // Rosso
        }
    } catch (e) {
        notify("Backend non raggiungibile", "error");
        statusDot.style.color = "#e74c3c"; // Rosso
    }
}

// SCARICA FILE
function downloadFile() {
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
}

// CARICA FILE (Trigger Input nascosto)
function triggerUpload() {
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