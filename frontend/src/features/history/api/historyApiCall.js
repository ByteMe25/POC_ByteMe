const API_URL = "/api";

/**
 * Carica le generazioni AI di un documento dal DB
 * @param {string} nomeDocumento
 * @returns {Promise<Array>} lista di generazioni
 */
export const loadStorico = async (nomeDocumento) => {
  const response = await fetch(`${API_URL}/load-storico`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nomeDocumento }),
  });

  if (!response.ok) throw new Error("Errore caricamento storico");

  const data = await response.json();
  return data.generazioni;
};

/**
 * Salva una generazione AI sul DB
 * @param {string} prompt
 * @param {string} risposta
 * @param {string} nomeDocumento
 * @returns {Promise<void>}
 */
export const saveGenerazione = async (prompt, risposta, nomeDocumento) => {
  const response = await fetch(`${API_URL}/save-ai-generation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ prompt, risposta, nomeDocumento }),
  });

  if (!response.ok) throw new Error("Errore salvataggio generazione");
};

/**
 * Elimina una generazione AI dal DB per id
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteGenerazione = async (id) => {
  const response = await fetch(`${API_URL}/delete-ai-generation/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Errore eliminazione generazione");
};
