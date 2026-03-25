import { IWidgetState } from "./states/IWidgetState";
import styles from "./AiWidget.module.css";

export const AiWidget = ({ state }: { state: IWidgetState }) => {
  const content = state.render();
  if (!content) return null;

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <span className={styles.title}>✨ AI</span>
      </div>
      {content}
    </div>
  );
};