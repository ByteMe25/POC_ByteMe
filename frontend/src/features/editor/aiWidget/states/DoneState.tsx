import { IWidgetState } from "./IWidgetState";
import { WidgetButtons } from "../WidgetButtons";
import styles from "../AiWidget.module.css";

export class DoneState implements IWidgetState {
  constructor(
    private result: string,
    private onInsert: () => void,
    private onDiscard: () => void
  ) {}

  render() {
    return (
      <>
        <div className={styles.body}>
          <pre className={styles.result}>{this.result}</pre>
        </div>
        <WidgetButtons buttons={[
          { label: "Inserisci nell'editor", onClick: this.onInsert, variant: "primary" },
          { label: "Scarta",                onClick: this.onDiscard, variant: "secondary" },
        ]} />
      </>
    );
  }
}