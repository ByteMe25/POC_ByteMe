import styles from "./SidebarButton.module.css";

export default function SidebarButton({ icon, tooltip, onClick, disabled }) {
  return (
    <button className={styles.button} onClick={onClick} title={tooltip} disabled={disabled}>
      {icon}
    </button>
  );
}