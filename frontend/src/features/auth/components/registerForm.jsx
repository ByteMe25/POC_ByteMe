import styles from "./registerForm.module.css";
import { useRegistration } from "../hooks/useRegistration";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const registerForm = () => {
    const { handleRegister, error } = useRegistration();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return(
        <div className={styles.container}>
            <button 
                className={styles['back-button']}
                type="button" 
                onClick={() => navigate(-1)}
            >
                Indietro
            </button>

            <h2 className={styles['auth-title']}>Register</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleRegister({ email, password }); }}>
                <label className={styles['form-label']}>Email</label>
                <input className={styles['form-input']} type="email" 
                placeholder="Inserisci la tua email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                />

                <label className={styles['form-label']}>Password</label>
                <input className={styles['form-input']} type="password" 
                placeholder="Inserisci la tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                />

                <button className={styles['form-button']} type="submit"> 
                    Registrati 
                </button>
            </form>
            {error && <p className={styles['error-message']}>{error}</p>}
        </div>
    );

}