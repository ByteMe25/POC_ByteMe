const API_URL = "/api";

export const openDocumentCall = async (docName) => {
  
  const response = await fetch(`${API_URL}/open-document`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nome: docName }),
  });

  

  
  const data = await response.json();
  

  if (!response.ok) {
    throw new Error(data.message || "Login fallito");
  }
  
  
  return data;
};