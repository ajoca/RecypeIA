import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Users, ChefHat, Eye, EyeOff, Lightbulb } from 'lucide-react';

const RecipeCard = ({ recipe, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'fácil': return 'from-green-500 to-emerald-600';
      case 'intermedio': return 'from-yellow-500 to-orange-600';
      case 'difícil': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-900/95 backdrop-blur-xl border border-green-500/20 rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4">
          <motion.div 
            className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(recipe.difficulty)} text-white text-sm font-semibold`}
            whileHover={{ scale: 1.05 }}
          >
            {recipe.difficulty}
          </motion.div>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white font-semibold">{recipe.rating}</span>
          <span className="text-gray-300 text-sm">({recipe.reviews})</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-2">{recipe.title}</h3>
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">{recipe.servings} porciones</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-green-400">
            <ChefHat className="w-5 h-5" />
            <span className="text-sm font-medium">{recipe.source}</span>
          </div>
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-medium hover:bg-green-500/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isExpanded ? 'Ocultar' : 'Ver Receta'}
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Ingredientes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-300">{ingredient}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Instrucciones
                </h4>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-gray-300 leading-relaxed">{instruction}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {recipe.tips && recipe.tips.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Consejos del Chef
                    </h4>
                    <motion.button
                      onClick={() => setShowTips(!showTips)}
                      className="text-green-400 text-sm font-medium hover:text-green-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {showTips ? 'Ocultar' : 'Mostrar'}
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {showTips && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {recipe.tips.map((tip, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                          >
                            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{tip}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecipeCard;