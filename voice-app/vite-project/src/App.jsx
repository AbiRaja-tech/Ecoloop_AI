// src/App.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import EcoCoach from './components/EcoCoach';
import ActionTracker from './components/ActionTracker';
import EcoPointsWallet from './components/EcoPointsWallet';
import ImpactDashboard from './components/ImpactDashboard';
import EcoChallenges from './components/EcoChallenges';
import GreenRewards from './components/GreenRewards';
import UserStats from './components/UserStats';
import EcoVoice from './components/evoice';
import EcoMapFeature from './components/EcoMapFeature';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import './components/Navbar.css';

function App() {
  const [userRecords, setUserRecords] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);

  const handleLogin = (records) => {
    setUserRecords(records);
  };

  const handleLogout = () => {
    setUserRecords(null);
    setActiveComponent(null);
  };

  const components = [
    { component: EcoCoach, title: 'Eco Coach' },
    { component: ActionTracker, title: 'Action Tracker' },
    { component: EcoPointsWallet, title: 'Eco Wallet' },
    { component: ImpactDashboard, title: 'Impact Dashboard' },
    { component: EcoChallenges, title: 'Eco Challenges' },
    { component: GreenRewards, title: 'Green Rewards' },
    { component: UserStats, title: 'User Stats' },
    { component: EcoVoice, title: 'Eco Voice' },
    { component: EcoMapFeature, title: 'Eco Map' },
    { component: AnalyticsDashboard, title: 'Analytics Dashboard' }, // Updated
  ];

  if (!userRecords || !Array.isArray(userRecords) || userRecords.length === 0) {
    return (
      <div className="app-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="centered-content"
        >
          <Login onLogin={handleLogin} />
        </motion.div>
      </div>
    );
  }

  const latestRecord = userRecords[userRecords.length - 1];

  return (
    <div className="app-container">
      <div className="centered-content">
        {/* Navbar */}
        <motion.nav
          className="navbar-animated"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="nav-content">
            {components.map((item, index) => (
              <motion.button
                key={index}
                className={`nav-button ${activeComponent === index ? 'active' : ''}`}
                onClick={() => setActiveComponent(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.title}
              </motion.button>
            ))}
            <motion.button
              className="nav-button logout-button"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </motion.nav>

        {/* Main Content */}
        <AnimatePresence>
          {activeComponent !== null && (
            <motion.div
              className="futuristic-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-header">
                <h2 className="holo-text">{components[activeComponent].title}</h2>
              </div>
              <div className="card-content">
                <motion.div
                  key={activeComponent}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {(() => {
                    const ActiveComponent = components[activeComponent].component;
                    return <ActiveComponent user={latestRecord} />;
                  })()}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;