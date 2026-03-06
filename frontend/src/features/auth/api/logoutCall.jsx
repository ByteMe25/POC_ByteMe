const API_URL = "/api";

export const logoutCall = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Logout fallito");
};