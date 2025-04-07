// src/components/ImpactDashboard.jsx
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { useState } from 'react';
import Popup from './Popup';

function ImpactDashboard({ user }) {
  const [showPopup, setShowPopup] = useState(false);

  const { carbon } = useSpring({
    from: { carbon: 0 },
    carbon: user?.Waste["Donation Made"] || 0,
    config: { tension: 200, friction: 20 },
  });
  const { water } = useSpring({
    from: { water: 0 },
    water: user?.Water["Greywater Use"]?.volumeReusedLitres || 0,
    config: { tension: 200, friction: 20 },
  });

  return (
    <div className="flex flex-col justify-between h-full text-center">
      <div>
        <div className="w-24 h-24 my-6 mx-auto flex justify-center items-center">
          <div className="w-16 h-16 bg-cyan-400 rounded-full flex justify-center items-center text-white text-2xl">
            💧
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-gray-300 font-vt323 text-xl">Carbon Saved</p>
            <animated.p className="text-3xl font-orbitron text-cyan-400 glow-text">
              {carbon.to(n => `${n.toFixed(2)} units`)}
            </animated.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-300 font-vt323 text-xl">Water Conserved</p>
            <animated.p className="text-3xl font-orbitron text-cyan-400 glow-text">
              {water.to(n => `${n.toFixed(0)} L`)}
            </animated.p>
          </motion.div>
        </div>
      </div>
      {showPopup && (
        <Popup
          message="Impact stats are for viewing only at this time."
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default ImpactDashboard;