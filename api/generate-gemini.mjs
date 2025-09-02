// api/generate-gemini.mjs
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const query = body?.query;
    if (!query) return res.status(400).json({ error: "Missing query" });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
Eres un experto culinario. Devuelve EXACTAMENTE un ARRAY JSON de 3 recetas top para "${query}",
ordenadas de mejor a peor por calidad/valoraciones. Mismo esquema que antes:
[id,title,rating,reviews,cookTime,difficulty,servings,image,ingredients[],instructions[],tips[],source]
No incluyas texto fuera del JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : [];
    }

    let recipes = Array.isArray(data) ? data : [data].filter(Boolean);

    // normalización mínima igual que antes
    recipes = recipes.map((it, i) => ({
      id: String(it?.id ?? `receta-${i + 1}`),
      title: String(it?.title ?? `Receta ${i + 1}`),
      rating: Number(it?.rating ?? 0),
      reviews: Number(it?.reviews ?? 0),
      cookTime: String(it?.cookTime ?? "—"),
      difficulty: ["Fácil", "Intermedio", "Difícil"].includes(it?.difficulty)
        ? it.difficulty
        : "Intermedio",
      servings: Number(it?.servings ?? 2),
      image: String(it?.image ?? ""),
      ingredients: Array.isArray(it?.ingredients) ? it.ingredients.map(String) : [],
      instructions: Array.isArray(it?.instructions) ? it.instructions.map(String) : [],
      tips: Array.isArray(it?.tips) ? it.tips.map(String) : [],
      source: String(it?.source ?? "AI"),
    }));

    // ranking y top-3
    recipes.sort((a, b) => {
      const score = (x) => (x.rating || 0) * Math.log((x.reviews || 0) + 2);
      return score(b) - score(a);
    });
    if (recipes.length < 3) {
      for (let i = recipes.length; i < 3; i++) {
        recipes.push({
          id: `mock-${i + 1}`,
          title: `Receta ${i + 1} de ${query} (Mock)`,
          rating: 4.2,
          reviews: 80,
          cookTime: "30 min",
          difficulty: "Fácil",
          servings: 2,
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
          ingredients: ["Ingrediente A", "Ingrediente B"],
          instructions: ["Paso 1", "Paso 2"],
          tips: [],
          source: "Mock AI",
        });
      }
    }
    recipes = recipes.slice(0, 3);

    return res.status(200).json({ recipes });
  } catch (err) {
    console.error("API /api/generate-gemini error:", err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}
