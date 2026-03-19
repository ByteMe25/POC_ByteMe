import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

/*
export interface genericAdapter{
    
    constructor(){}

    getEditorText();

    insertText(text);

    destroy();  
};

this should guarantee consistency between adapters but that's not possible in jsx
*/

export class easyMDEAdapter{
    
    constructor({element, ...options}){
        this.instance = new EasyMDE({element, ...options });
     }

    getEditorText(){
        return this.instance.value();
    }

    setContent(text){
        this.instance.value(text);
    }

    insertTextAtCursorPosition(text){
        const cm = this.instance.codemirror;
        cm.replaceRange("\n" + text, cm.getCursor());
    }

    enableSideBySide(){
        this.instance.toggleSideBySide();
    }

    destroy() {
        this.instance.toTextArea();
        this.instance.null;
    }
     
};

/*
in mancanza di interfacce, queata seguente classe può essere scritta come vogliamo, 
se faccimao un typo con i nomi delle funzioni non c'è nessuno che ci aiuta.


s
export class otherMDEAdapter{
    //const { textareaRef, getEditorText, insertText } = useEditor(docName);
    constructor(){
        this.instance = new specificMDE();
     }

    getEditorText(){
        return specificMDELogic()
    }

    insertText(text){
        specificMDELogic()
    }

    destroy() {
        specificMDELogic()
    }
    
    
    
};
*/