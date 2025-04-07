import { motion } from 'framer-motion';
import { useState } from 'react';

function EcoCoach({ user }) {
  const tips = user
    ? [
        `Walk ${user.Mobility["Walking Distance (km)"] || 0} km to reduce your carbon footprint`,
        "Use refill stations to cut down on plastic waste",
        `Turn off idle devices to save ${user.Energy["Idle Device Shutdowns"]?.energySaved_kWh || 0} kWh`,
      ]
    : ["Loading tips..."];
  const [tipIndex, setTipIndex] = useState(0);

  return (
    <motion.div
      className="flex flex-col justify-between h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p
        key={tipIndex}
        className="text-gray-400 font-vt323 text-xl tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {tips[tipIndex]}
      </motion.p>
      <motion.button
        className="glass-button self-end"
        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTipIndex((prev) => (prev + 1) % tips.length)}
      >
        Next Tip
      </motion.button>
    </motion.div>
  );
}

export default EcoCoach;