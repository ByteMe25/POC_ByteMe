import styles from "./TopBar.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../features/auth/hooks/useLogout";

export default function TopBar() {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Il mio editor</h1>

      {user ? (
        <>
          <span className={styles.userEmail}>{user.email}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className={styles.loginLink}>Accedi</Link>
          <Link to="/register" className={styles.registerLink}>Registrati</Link>
        </>
      )}
    </div>
  );
}