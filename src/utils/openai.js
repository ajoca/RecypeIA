import OpenAI from 'openai';

// Carga la variable de entorno directamente aquí
// En un entorno de desarrollo React, las variables de entorno se acceden con process.env.NOMBRE_VARIABLE
// Asegúrate de que tu entorno de ejecución (como Vercel, Netlify, etc.) también tenga esta variable configurada.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Esto es solo para desarrollo, en producción usar un backend
});

export const searchRecipesWithAI = async (query) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY no está configurada. Por favor, agrégala en el archivo .env o en la configuración de tu entorno.");
    // Retorna un mock o un error si la clave no está configurada
    return [
      {
        id: 'mock-1',
        title: `Receta de ${query} (Mock)`,
        rating: 4.5,
        reviews: 100,
        cookTime: '30 min',
        difficulty: 'Fácil',
        servings: 4,
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f6962485f?auto=format&fit=crop&w=400&q=80',
        ingredients: [
          'Ingrediente 1 (mock)',
          'Ingrediente 2 (mock)',
          'Ingrediente 3 (mock)'
        ],
        instructions: [
          'Paso 1 (mock): Haz esto.',
          'Paso 2 (mock): Luego esto otro.',
          'Paso 3 (mock): Y finalmente esto.'
        ],
        tips: ['Consejo mock 1', 'Consejo mock 2'],
        source: 'Mock AI'
      },
      {
        id: 'mock-2',
        title: `Otra Receta de ${query} (Mock)`,
        rating: 4.2,
        reviews: 80,
        cookTime: '45 min',
        difficulty: 'Intermedio',
        servings: 2,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        ingredients: [
          'Ingrediente A (mock)',
          'Ingrediente B (mock)'
        ],
        instructions: [
          'Paso A (mock): Comienza así.',
          'Paso B (mock): Sigue con esto.'
        ],
        tips: [],
        source: 'Mock AI'
      },
      {
        id: 'mock-3',
        title: `Tercera Receta de ${query} (Mock)`,
        rating: 4.0,
        reviews: 60,
        cookTime: '60 min',
        difficulty: 'Difícil',
        servings: 6,
        image: 'https://images.unsplash.com/photo-1512621776951-a579eddc87f4?auto=format&fit=crop&w=400&q=80',
        ingredients: [
          'Ingrediente X (mock)',
          'Ingrediente Y (mock)',
          'Ingrediente Z (mock)'
        ],
        instructions: [
          'Paso X (mock): Prepara todo.',
          'Paso Y (mock): Cocina con cuidado.',
          'Paso Z (mock): Sirve y disfruta.'
        ],
        tips: ['Consejo mock extra'],
        source: 'Mock AI'
      }
    ];
  }

  const prompt = `Busca las 3 mejores recetas para "${query}" en internet o libros de cocina. Para cada receta, proporciona la siguiente información en formato JSON. Asegúrate de que la información sea detallada y útil para cocinar. Si no encuentras 3, proporciona las que encuentres.

  Formato JSON requerido para cada receta:
  {
    "id": "string_unico",
    "title": "string",
    "rating": "number (ej. 4.8)",
    "reviews": "number (ej. 2847)",
    "cookTime": "string (ej. '20 min', '3 horas')",
    "difficulty": "string ('Fácil', 'Intermedio', 'Difícil')",
    "servings": "number",
    "image": "url_de_imagen_relevante_y_de_alta_calidad",
    "ingredients": ["string", "string", ...],
    "instructions": ["string", "string", ...],
    "tips": ["string", "string", ...],
    "source": "string (ej. 'Cocina Italiana Tradicional', 'The Joy of Cooking')"
  }

  Ejemplo de respuesta (solo si no hay resultados reales, de lo contrario, genera recetas reales):
  [
    {
      "id": "carbonara-123",
      "title": "Pasta Carbonara Clásica",
      "rating": 4.8,
      "reviews": 2847,
      "cookTime": "20 min",
      "difficulty": "Fácil",
      "servings": 4,
      "image": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
      "ingredients": ["400g de espaguetis", "200g de panceta", "4 huevos grandes", "100g de queso parmesano", "Pimienta negra"],
      "instructions": ["Hierve la pasta.", "Fríe la panceta.", "Mezcla huevos y queso.", "Combina todo."],
      "tips": ["No cocines los huevos.", "Usa guanciale si puedes."],
      "source": "Cocina Italiana Tradicional"
    }
  ]
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // O el modelo más reciente que prefieras
      messages: [
        {
          role: "system",
          content: "Eres un experto culinario y un asistente de búsqueda de recetas. Tu tarea es encontrar las mejores recetas y presentarlas en un formato JSON estructurado y fácil de usar. Siempre busca las 3 mejores recetas y proporciona detalles completos."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    // OpenAI a veces devuelve el JSON dentro de un bloque de código, así que lo parseamos
    const jsonString = content.replace(/\n|\n/g, '');
    const parsedRecipes = JSON.parse(jsonString);

    // Asegurarse de que siempre sea un array, incluso si OpenAI devuelve un solo objeto
    return Array.isArray(parsedRecipes) ? parsedRecipes : [parsedRecipes];

  } catch (error) {
    console.error("Error al llamar a OpenAI:", error);
    // En caso de error, puedes retornar un array vacío o un mensaje de error
    return [];
  }
};