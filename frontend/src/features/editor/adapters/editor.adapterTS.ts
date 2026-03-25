import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

export interface GenericAdapter {
  getEditorText(): string;
  setContent(text: string): void;
  insertTextAtCursorPosition(text: string): void;
  enableSideBySide(): void;
  destroy(): void;
  addLineWidget(domElement: HTMLElement): any;
}

export class EasyMDEAdapter implements GenericAdapter {
  private instance!: InstanceType<typeof EasyMDE>;

  constructor({ element, ...options }: { element: HTMLTextAreaElement } & [key: string]) {
    this.instance = new EasyMDE({ element, ...options });
  }

  getEditorText(): string {
    return this.instance.value();
  }

  setContent(text: string): void {
    this.instance.value(text);
  }

  insertTextAtCursorPosition(text: string): void {
    const cm = this.instance.codemirror;
    cm.replaceRange("\n" + text, cm.getCursor());
  }

  enableSideBySide(): void {
    this.instance.toggleSideBySide();
  }

  addLineWidget(domElement: HTMLElement): any {
    const cm = this.instance.codemirror;
    const cursor = cm.getCursor("to");
    return cm.addLineWidget(cursor.line, domElement);
  }

  destroy(): void {
    this.instance.toTextArea();
    this.instance = null!;
  }
}

/*
  Senza interfacce, la classe seguente potrebbe essere scritta come vogliamo,
  ma se facciamo un typo con i nomi delle funzioni non c'è nessuno che ci aiuta.
  
  export class OtherMDEAdapter implements GenericAdapter {
    constructor() {
      this.instance = new SpecificMDE();
    }
    getEditorText(): string {
      return specificMDELogic();
    }
    insertTextAtCursorPosition(text: string): void {
      specificMDELogic();
    }
    enableSideBySide(): void {
      specificMDELogic();
    }
    destroy(): void {
      specificMDELogic();
    }
  }
*/