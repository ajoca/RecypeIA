import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import Timer from './components/Timer';
import { searchRecipesWithAI } from './utils/openai';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query) => {
    setIsLoading(true);
    setSearchQuery(query);
    setHasSearched(true);
    setRecipes([]); // Limpiar recetas anteriores

    try {
      const fetchedRecipes = await searchRecipesWithAI(query);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error al buscar recetas:', error);
      // Aquí podrías establecer un mensaje de error para el usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingState />
                </motion.div>
              )}

              {!isLoading && !hasSearched && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState />
                </motion.div>
              )}

              {!isLoading && hasSearched && recipes.length > 0 && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="mb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Las 3 mejores recetas para "{searchQuery}"
                    </h2>
                    <p className="text-gray-400">
                      Seleccionadas por IA basándose en reseñas y calidad
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {recipes.map((recipe, index) => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {!isLoading && hasSearched && recipes.length === 0 && (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    No encontré recetas para "{searchQuery}"
                  </h3>
                  <p className="text-gray-400">
                    Intenta con otro término de búsqueda o revisa las sugerencias
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:col-span-1">
            <Timer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;