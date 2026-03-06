import { loginCall } from "../api/loginCall";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async ({ email, password }) => {
    try {
      await loginCall(email, password);
      login(email);
      navigate("/editor");
    } catch (err) {
      setError("Email o password errati");
    }
  };

  return { handleLogin, error };
};