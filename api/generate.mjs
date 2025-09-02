// api/generate.mjs
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query } = req.body || {};
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing query" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Pedimos EXACTAMENTE 3 recetas, con rating/reviews para poder rankear
    const system = `
Eres un experto culinario y buscador de recetas.
Devuelve EXACTAMENTE un ARRAY JSON de 3 recetas, ORDENADAS de mejor a peor,
en base a calidad/valoraciones (rating y reviews). No incluyas texto fuera del JSON.
Cada receta debe tener estas claves con estos tipos:
{
  "id": "string",
  "title": "string",
  "rating": number,           // 0..5
  "reviews": number,          // cantidad de reseñas
  "cookTime": "string",       // ej. "30 min"
  "difficulty": "Fácil" | "Intermedio" | "Difícil",
  "servings": number,
  "image": "string",          // URL válida
  "ingredients": string[],    // 6-14 items
  "instructions": string[],   // 6-12 pasos
  "tips": string[],           // 0-5 tips
  "source": "string"          // libro/sitio/origen
}
Si no hay datos reales suficientes, usa estimaciones plausibles, pero siempre respeta los tipos.
`;
    const user = `Busca las 3 mejores recetas para: "${query}".`;

    const r = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    // Extraer texto de la respuesta
    const text =
      r?.output_text ??
      r?.output?.[0]?.content?.[0]?.text ??
      "";

    // Intentar parseo robusto
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : [];
    }

    // Normalizar a array
    let recipes = Array.isArray(data) ? data : [data].filter(Boolean);

    // Limpieza y tipado mínimo
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

    // Ranking adicional por si el modelo no ordena bien (rating * log(reviews+1))
    recipes.sort((a, b) => {
      const score = (x) => (x.rating || 0) * Math.log((x.reviews || 0) + 2);
      return score(b) - score(a);
    });

    // Asegurar EXACTAMENTE 3 (si vienen más, cortar; si vienen menos, rellenar mocks)
    const fillMock = (idx) => ({
      id: `mock-${idx}`,
      title: `Receta ${idx} de ${query} (Mock)`,
      rating: 4.2,
      reviews: 80,
      cookTime: "30 min",
      difficulty: "Fácil",
      servings: 2,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      ingredients: ["Ingrediente A", "Ingrediente B", "Ingrediente C"],
      instructions: ["Paso 1", "Paso 2", "Paso 3"],
      tips: [],
      source: "Mock AI",
    });

    if (recipes.length < 3) {
      for (let i = recipes.length; i < 3; i++) recipes.push(fillMock(i + 1));
    }
    recipes = recipes.slice(0, 3);

    return res.status(200).json({ recipes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
