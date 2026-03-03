import styles from "./TopBar.module.css";

export default function TopBar() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Il mio editor</h1>
    </div>
  );
}