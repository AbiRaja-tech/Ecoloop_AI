// src/components/EcoChallenges.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import Popup from './Popup';

function EcoChallenges({ user }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="flex flex-col justify-between h-full text-center">
      <div>
        <motion.p
          className="text-cyan-400 font-vt323 text-2xl mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Zero Waste Week
        </motion.p>
        <motion.p
          className="text-gray-300 font-vt323 text-xl mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {user ? `Points: ${user.Community.Points || 0}` : "Loading..."}
        </motion.p>
      </div>
      <motion.button
        className="glass-button mt-6"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPopup(true)}
      >
        Join Mission
      </motion.button>
      {showPopup && (
        <Popup
          message="Challenges are coming soon! Stay tuned."
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default EcoChallenges;