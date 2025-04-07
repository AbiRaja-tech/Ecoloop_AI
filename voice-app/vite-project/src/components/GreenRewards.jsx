// src/components/GreenRewards.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import Popup from './Popup';

function GreenRewards({ user }) {
  const [showPopup, setShowPopup] = useState(false);

  const totalPoints = user
    ? (user.Mobility.Points || 0) +
      (user.Consumption.Points || 0) +
      (user.Waste["Points from Donation"] || 0) +
      (user.Waste["Points from Compost"] || 0) +
      (user.Energy.Points || 0) +
      (user.Water.Points || 0) +
      (user.Community.Points || 0)
    : 0;

  return (
    <div className="flex flex-col justify-between h-full text-center">
      <div className="space-y-4">
        <motion.p
          className="text-cyan-400 font-vt323 text-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Bamboo Brush - 200 Pts
        </motion.p>
        <motion.p
          className="text-cyan-400 font-vt323 text-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Eco-Fest Pass - {totalPoints >= 500 ? '500 Pts' : 'Locked'}
        </motion.p>
      </div>
      <motion.button
        className="glass-button mt-6"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPopup(true)}
      >
        Redeem Now
      </motion.button>
      {showPopup && (
        <Popup
          message={totalPoints < 200 ? "You need more points to redeem rewards!" : "Redemption coming soon!"}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default GreenRewards;