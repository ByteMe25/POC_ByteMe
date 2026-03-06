import {registerCall} from "../api/registerCall";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export const useRegistration = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async ({email, password}) => {
    try {
      await registerCall(email, password);
      
      navigate("/login");
    } catch (err) {
      console.log("caught error:", err.message);
      setError("registrazione fallita!!!!");
    }
  };

  return { handleRegister, error };
};