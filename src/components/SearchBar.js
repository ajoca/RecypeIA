import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, ChefHat } from 'lucide-react';

const SearchBar = ({ onSearch = () => {}, isLoading = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const suggestions = [
    'pasta carbonara',
    'tacos mexicanos',
    'risotto de hongos',
    'pollo al curry',
    'pizza margherita'
  ];

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-gray-900/95 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center">
              <div className="pl-6 pr-4 py-6">
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                >
                  {isLoading ? (
                    <Sparkles className="w-6 h-6 text-green-400" />
                  ) : (
                    <Search className="w-6 h-6 text-green-400" />
                  )}
                </motion.div>
              </div>
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué quieres cocinar hoy? Ej: pasta carbonara, tacos mexicanos..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 text-lg font-medium py-6 pr-6 focus:outline-none"
                disabled={isLoading}
              />
              
              <motion.button
                type="submit"
                disabled={!query.trim() || isLoading}
                className={`mr-4 px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  query.trim() && !isLoading
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={query.trim() && !isLoading ? { scale: 1.05 } : {}}
                whileTap={query.trim() && !isLoading ? { scale: 0.95 } : {}}
              >
                <ChefHat className="w-5 h-5" />
                {isLoading ? 'Buscando...' : 'Buscar Recetas'}
              </motion.button>
            </div>
          </div>
        </form>

        <motion.div 
          className="mt-6 flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-gray-400 text-sm font-medium">Sugerencias:</span>
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
              }}
              className="px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-300 text-sm font-medium hover:bg-gray-700 hover:border-green-500/50 hover:text-green-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchBar;