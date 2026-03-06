import styles from "./TopBar.module.css";
import { Link } from "react-router-dom";
/* nota: in jsx i link <a> sono usati solo per link esterni alla app 
      perché forza un rerendering di tutta la pagina, rendendo inutile il riutilizzo delle componenti. 
      Ad esempio se avessimo un logo che rimane in ogni pagina, questo verrebbe ricaricato ad ogni <a> interno
      <Link> risolve questo problema */


export default function TopBar() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Il mio editor</h1>


      

      <Link to="/login" className={styles.loginLink}>Accedi</Link>
      <Link to="/register" className={styles.registerLink} >Registrati</Link>

      {/* inizialmente nascosti */}
      <button className={styles.logoutBtn}> Logout </button>
      <a className={styles.userEmail}> %%email%% </a>
    </div>
  );
}