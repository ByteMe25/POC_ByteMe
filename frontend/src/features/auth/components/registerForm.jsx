//import styles from "./registerForm.module.css";
import { useRegistration } from "../hooks/useRegistration";
import { useState } from "react";

export const registerForm = () => {
    const { handleRegister, error } = useRegistration();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    return(
        <div>
            <h2 className="auth-title">Register</h2>
            <form>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" 
                placeholder="Inserisci la tua email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                />

                <label className="form-label">Password</label>
                <input className="form-input" type="password" 
                placeholder="Inserisci la tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                />

                <button className="form-button" onClick={() => handleRegister({ email, password })}> 
                    Registrati 
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
    
}