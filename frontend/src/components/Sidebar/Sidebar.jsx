import { useState } from "react";
import styles from "./Sidebar.module.css";

export const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <button className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "<" : ">"}
      </button>
      {isOpen && (
        <div className={styles.buttons}>
          {children}
        </div>
      )}
    </div>
  );
};