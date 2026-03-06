import { logoutCall } from "../api/logoutCall";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutCall();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout fallito:", err);
    }
  };

  return { handleLogout };
};