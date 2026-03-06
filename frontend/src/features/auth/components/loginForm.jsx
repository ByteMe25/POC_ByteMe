//import styles from "./loginForm.module.css";

export const loginForm = () => {
    return(
        <div>
            <h2 className="auth-title">Login</h2>
            <form>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="Inserisci la tua email" />

                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Inserisci la tua password" />

                <button className="form-button" type="submit">Accedi</button>
            </form>
        </div>
    );
}