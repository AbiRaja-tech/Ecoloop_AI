// src/components/ActionTracker.jsx
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { useState } from 'react';
import Popup from './Popup';

function ActionTracker({ user }) {
  const [showPopup, setShowPopup] = useState(false);

  const actions = user
    ? [
        { name: `Walked ${user.Mobility["Walking Distance (km)"] || 0} km`, points: user.Mobility.Points || 0, verified: true },
        { name: `Composted ${user.Waste["Compost Used (kg)"] || 0} kg`, points: user.Waste["Points from Compost"] || 0, verified: true },
      ]
    : [{ name: "Loading actions...", points: 0, verified: false }];

  const totalPointsPossible = actions.reduce((sum, action) => sum + action.points, 0);
  const verifiedPoints = actions
    .filter(action => action.verified)
    .reduce((sum, action) => sum + action.points, 0);
  const progress = totalPointsPossible ? Math.round((verifiedPoints / totalPointsPossible) * 100) : 0;

  const progressSpring = useSpring({
    from: { width: '0%' },
    to: { width: `${progress}%` },
    config: { tension: 200, friction: 20 },
  });

  return (
    <motion.div
      className="flex flex-col justify-between h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className="w-24 h-24 my-4 mx-auto relative">
          <div className="absolute inset-0 flex justify-center items-center">
            <div
              className="w-20 h-20 rounded-full border-2 border-[rgba(6,182,212,0.5)] flex justify-center items-center"
              style={{
                background: `conic-gradient(rgba(6, 182, 212, 0.8) ${progress}%, rgba(87, 83, 78, 0.8) ${progress}%)`,
              }}
            >
              <span className="text-lg font-bold holo-text">{progress}%</span>
            </div>
          </div>
        </div>
        <ul className="space-y-3">
          {actions.map((action, idx) => (
            <motion.li
              key={idx}
              className="flex justify-between text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <span className="text-stone-400">{action.name}</span>
              <span className={action.verified ? "holo-text" : "text-stone-500"}>
                {action.points.toFixed(2)} {action.verified ? "✓" : "⏳"}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
          <animated.div
            className="h-full rounded-full"
            style={{
              width: progressSpring.width,
              background: 'linear-gradient(to right, rgba(6, 182, 212, 0.8), rgba(87, 83, 78, 0.8))',
            }}
          />
        </div>
      </div>
      {showPopup && (
        <Popup
          message="Action tracking is view-only for now."
          onClose={() => setShowPopup(false)}
        />
      )}
    </motion.div>
  );
}

export default ActionTracker;