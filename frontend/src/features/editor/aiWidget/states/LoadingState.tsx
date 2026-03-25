import { IWidgetState } from "./IWidgetState";
import styles from "../AiWidget.module.css";

export class LoadingState implements IWidgetState {
  render() {
    return (
      <>
        <div className={styles.body}>
          <div className={styles.loading}>
            <div>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <p className={styles.loadingText}>Elaborazione in corso…</p>
          </div>
        </div>
      </>
    );
  }
}