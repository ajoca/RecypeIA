import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, Search } from 'lucide-react';

const LoadingState = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-8">
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChefHat className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>
      </div>

      <motion.h3 
        className="text-2xl font-bold text-white mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Buscando las mejores recetas...
      </motion.h3>
      
      <motion.p 
        className="text-gray-400 text-center max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Estoy analizando miles de recetas para encontrar las 3 mejores opciones con las reseñas más altas. 
        Esto tomará solo unos segundos.
      </motion.p>

      <div className="flex items-center gap-2 mt-8">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-green-500 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingState;