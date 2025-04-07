// src/components/EcoPointsWallet.jsx
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { useState } from 'react';
import Popup from './Popup';

function EcoPointsWallet({ user }) {
  const [showPopup, setShowPopup] = useState(false);

  const totalPoints = user
    ? (Number(user.Mobility?.Points || 0) +
       Number(user.Consumption?.Points || 0) +
       Number(user.Waste?.["Points from Donation"] || 0) +
       Number(user.Waste?.["Points from Compost"] || 0) +
       Number(user.Energy?.Points || 0) +
       Number(user.Water?.Points || 0) +
       Number(user.Community?.Points || 0))
    : 0;

  const props = useSpring({
    from: { number: 0 },
    to: { number: totalPoints },
    config: { tension: 200, friction: 20 },
  });

  return (
    <motion.div
      className="flex flex-col justify-between h-full text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <animated.p className="text-5xl font-bold holo-text mb-4">
          {props.number.to(n => n.toFixed(2))}
        </animated.p>
        <p className="text-stone-400 text-lg tracking-wide">Eco Points Earned</p>
      </div>
      <motion.button
        className="glass-button mt-4 mx-auto"
        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onClick={() => setShowPopup(true)}
      >
        <span className="bg-gradient-to-r from-cyan-200 to-stone-200 bg-clip-text text-transparent font-bold">
          View Transactions
        </span>
      </motion.button>
      {showPopup && (
        <Popup
          message="Transactions are not available yet."
          onClose={() => setShowPopup(false)}
        />
      )}
    </motion.div>
  );
}

export default EcoPointsWallet;