// api/generate-gemini.mjs
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY missing");
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    // Body puede venir como string
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const query = body?.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing query" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Eres un experto culinario. Devuelve EXACTAMENTE un ARRAY JSON con 3 recetas top para "${query}",
ordenadas de mejor a peor por calidad/valoraciones. Esquema:
[id,title,rating(realc),reviews(int),cookTime(str),difficulty("Fácil"|"Intermedio"|"Difícil"),
servings(int),image(url),ingredients[str],instructions[str],tips[str],source(str)]
No incluyas texto fuera del JSON.
`;

    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() ?? "";

    // Log útil (se ve en Vercel → Deployments → Functions → /api/generate-gemini)
    console.log("Gemini raw length:", text?.length ?? 0);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : [];
    }

    let recipes = Array.isArray(data) ? data : [data].filter(Boolean);

    // Normalización mínima
    recipes = recipes.map((it, i) => ({
      id: String(it?.id ?? `receta-${i + 1}`),
      title: String(it?.title ?? `Receta ${i + 1}`),
      rating: Number(it?.rating ?? 0),
      reviews: Number(it?.reviews ?? 0),
      cookTime: String(it?.cookTime ?? "—"),
      difficulty: ["Fácil", "Intermedio", "Difícil"].includes(it?.difficulty)
        ? it.difficulty : "Intermedio",
      servings: Number(it?.servings ?? 2),
      image: String(it?.image ?? ""),
      ingredients: Array.isArray(it?.ingredients) ? it.ingredients.map(String) : [],
      instructions: Array.isArray(it?.instructions) ? it.instructions.map(String) : [],
      tips: Array.isArray(it?.tips) ? it.tips.map(String) : [],
      source: String(it?.source ?? "AI"),
    }));

    // Re-ranking (rating * log(reviews+2))
    recipes.sort((a, b) => {
      const score = (x) => (x.rating || 0) * Math.log((x.reviews || 0) + 2);
      return score(b) - score(a);
    });

    // Forzar exactamente 3
    const fillMock = (idx) => ({
      id: `mock-${idx}`,
      title: `Receta ${idx} de ${query} (Mock)`,
      rating: 4.2,
      reviews: 80,
      cookTime: "30 min",
      difficulty: "Fácil",
      servings: 2,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      ingredients: ["Ingrediente A", "Ingrediente B", "Ingrediente C"],
      instructions: ["Paso 1", "Paso 2", "Paso 3"],
      tips: [],
      source: "Mock AI",
    });
    if (recipes.length < 3) for (let i = recipes.length; i < 3; i++) recipes.push(fillMock(i + 1));
    recipes = recipes.slice(0, 3);

    return res.status(200).json({ recipes });
  } catch (err) {
    console.error("API /api/generate-gemini error:", err?.response?.data || err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}
