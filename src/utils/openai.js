// src/utils/openai.ts  (o .js)
export async function searchRecipesWithAI(query: string) {
  if (!query?.trim()) return [];
  try {
    const r = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!r.ok) throw new Error(`AI request failed: ${r.status}`);
    const { recipes } = await r.json();
    return Array.isArray(recipes) ? recipes : [];
  } catch (e) {
    console.error("Error AI:", e);
    return [];
  }
}
