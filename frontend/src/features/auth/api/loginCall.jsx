const API_URL = "/api";

export const loginCall = async (emailVal, passwordVal) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // importante per la sessione Flask
    body: JSON.stringify({ email: emailVal, password: passwordVal }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Login fallito");
  }
};