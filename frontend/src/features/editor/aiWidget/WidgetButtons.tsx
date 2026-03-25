import styles from "./AiWidget.module.css";

export interface WidgetButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export const WidgetButtons = ({ buttons }: { buttons: WidgetButton[] }) => (
  <div className={styles.footer}>
    {buttons.map((btn) => (
      <button
        key={btn.label}
        className={btn.variant === "primary" ? styles.insertBtn : styles.discardBtn}
        onClick={btn.onClick}
      >
        {btn.label}
      </button>
    ))}
  </div>
);