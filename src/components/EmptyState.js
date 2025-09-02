import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChefHat, Utensils } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-8 border border-gray-700"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChefHat className="w-16 h-16 text-gray-400" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        className="text-3xl font-bold text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        ¡Listo para cocinar!
      </motion.h3>
      
      <motion.p 
        className="text-gray-400 text-lg max-w-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Busca cualquier receta y te mostraré las 3 mejores opciones con las reseñas más altas, 
        explicadas paso a paso para que no tengas excusas para no cocinar.
      </motion.p>

      <motion.div 
        className="flex items-center gap-8 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-col items-center gap-2">
          <Search className="w-8 h-8" />
          <span className="text-sm font-medium">Busca</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-700"></div>
        <div className="flex flex-col items-center gap-2">
          <Utensils className="w-8 h-8" />
          <span className="text-sm font-medium">Cocina</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-700"></div>
        <div className="flex flex-col items-center gap-2">
          <ChefHat className="w-8 h-8" />
          <span className="text-sm font-medium">Disfruta</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;