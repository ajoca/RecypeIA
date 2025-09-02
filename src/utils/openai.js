// src/utils/openai.ts
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
    // Fallback 1 receta mock
    return [
      {
        id: "mock-1",
        title: `Receta de ${query} (Mock)`,
        rating: 4.5,
        reviews: 100,
        cookTime: "30 min",
        difficulty: "Fácil",
        servings: 4,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f6962485f?auto=format&fit=crop&w=400&q=80",
        ingredients: ["Ingrediente 1", "Ingrediente 2", "Ingrediente 3"],
        instructions: ["Paso 1", "Paso 2", "Paso 3"],
        tips: ["Consejo mock 1"],
        source: "Mock AI",
      },
    ];
  }
}
