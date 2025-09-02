export async function searchRecipesWithAI(query) {
  const r = await fetch("/api/generate-gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!r.ok) throw new Error(`AI request failed: ${r.status}`);
  const { recipes } = await r.json();
  return Array.isArray(recipes) ? recipes : [];
}
