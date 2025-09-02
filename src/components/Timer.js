import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Bell, Timer as TimerIcon } from 'lucide-react';

const Timer = () => {
  const [time, setTime] = useState(0); // Tiempo en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, time]);

  const handleStartPause = () => {
    if (time === 0 && inputMinutes) {
      const initialTime = parseInt(inputMinutes, 10) * 60;
      if (!isNaN(initialTime) && initialTime > 0) {
        setTime(initialTime);
        setIsRunning(true);
      }
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setInputMinutes('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="bg-gray-900/95 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <TimerIcon className="w-6 h-6 text-green-400" />
        Temporizador de Cocina
      </h3>

      <div className="mb-6">
        {time === 0 && !isRunning ? (
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            placeholder="Minutos"
            className="w-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-4xl font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ) : (
          <motion.div
            key={time}
            className={`text-7xl font-mono font-bold ${time <= 10 && time > 0 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(time)}
          </motion.div>
        )}
      </div>

      <div className="flex gap-4">
        <motion.button
          onClick={handleStartPause}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
            (time === 0 && !inputMinutes) || (time > 0 && time === parseInt(inputMinutes, 10) * 60 && isRunning)
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={(time === 0 && !inputMinutes) || (time > 0 && time === parseInt(inputMinutes, 10) * 60 && isRunning)}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </motion.button>

        <motion.button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-gray-700 text-gray-300 shadow-lg hover:shadow-xl hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          Reiniciar
        </motion.button>
      </div>

      {time === 0 && !isRunning && inputMinutes && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-gray-400 flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          ¡Tiempo terminado!
        </motion.div>
      )}

      <audio ref={audioRef} src="/bell.mp3" preload="auto" />
    </motion.div>
  );
};

export default Timer;