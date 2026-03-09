import styles from "./loginForm.module.css";

import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
    const { handleLogin, error } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <div className={styles.container}>

            <button 
                className={styles['back-button']}
                type="button" 
                onClick={() => navigate(-1)}
            >
                Indietro
            </button>

            <h2 className={styles['auth-title']}>Login</h2>
            <form>
                <label className={styles['form-label']}>Email</label>
                <input
                    className={styles['form-input']}
                    type="email"
                    placeholder="Inserisci la tua email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className={styles['form-label']}>Password</label>
                <input
                    className={styles['form-input']}
                    type="password"
                    placeholder="Inserisci la tua password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className={styles['form-button']}
                    onClick={() => handleLogin({ email, password })}
                >
                    Accedi
                </button>
            </form>
            {error && <p className={styles['error-message']}>{error}</p>}
        </div>
    );
};