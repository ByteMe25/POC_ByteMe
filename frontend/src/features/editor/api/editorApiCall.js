export async function callAI(text, operation) {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, operation }),
  });
  if (!response.ok) throw new Error(`Errore API: ${response.status}`);
  const data = await response.json();
  return data.generated_text;
}