import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, Star } from 'lucide-react';

const Header = () => {
  return (
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-center gap-4 mb-6">
        <motion.div 
          className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChefHat className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-green-400" />
        </motion.div>
      </div>

      <motion.h1 
        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-green-100 to-green-300 bg-clip-text text-transparent mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        RecipeAI
      </motion.h1>
      
      <motion.p 
        className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Tu asistente culinario inteligente que encuentra las mejores recetas de internet, 
        analizadas y mejoradas para que cocines como un chef profesional.
      </motion.p>

      <motion.div 
        className="flex items-center justify-center gap-6 text-gray-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="font-medium">Mejores reseñas</span>
        </div>
        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-400" />
          <span className="font-medium">IA mejorada</span>
        </div>
        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-blue-400" />
          <span className="font-medium">Paso a paso</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Header;