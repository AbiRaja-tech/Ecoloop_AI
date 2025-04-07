// src/components/Login.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './login.css';
import loginGraphic from '../assets/login.png'; // Reuse signup graphic or replace with a login-specific one

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    const normalizedUserId = userId.toLowerCase();
    try {
      console.log('Fetching users from Firestore with UniqueID:', normalizedUserId);
      const usersRef = collection(db, 'ecoData');
      const snapshot = await getDocs(usersRef);

      console.log('Total documents fetched:', snapshot.size);
      const allDocs = snapshot.docs.map(doc => doc.data());
      console.log('All documents:', JSON.stringify(allDocs, null, 2));

      const filtered = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.UniqueID === normalizedUserId) {
          filtered.push({ id: doc.id, ...data });
        }
      });

      console.log('Filtered records:', filtered);

      if (filtered.length > 0) {
        console.log('User records matched:', filtered);
        onLogin(filtered);
        setError(null);
      } else {
        setError('User not found');
        console.log('No matching documents found for UniqueID:', normalizedUserId);
      }
    } catch (err) {
      console.error('Firestore Fetch Error:', err);
      setError('Something went wrong while loading user data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please enter a User ID');
      return;
    }
    await fetchUser();
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <img src={loginGraphic} alt="Login Graphic" className="login-graphic" />
        <motion.h2
          className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-stone-600 via-violet-400 bg-clip-text text-transparent mb-4 text-center"
          variants={inputVariants}
        >
          Login to EcoVerse
        </motion.h2>
        <motion.p
          className="text-sm text-stone-400 mb-4 text-center"
          variants={inputVariants}
        >
          Access your eco-friendly dashboard
        </motion.p>
        {error && (
          <motion.p
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        <form className="login-form" onSubmit={handleLogin}>
          <motion.input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID (e.g., user_001)"
            className="input-field"
            required
            variants={inputVariants}
          />
          <motion.input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-field"
            required
            variants={inputVariants}
          />
          <motion.button
            type="submit"
            className="button"
            disabled={loading}
            variants={buttonVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.9), 0 0 25px rgba(6, 182, 212, 0.5)',
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="bg-gradient-to-r from-cyan-200 to-stone-200 bg-clip-text text-transparent font-bold">
              {loading ? 'Logging in...' : 'Login'}
            </span>
          </motion.button>
        </form>
      </motion.div>
      <motion.div
        className="accents"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="acc-card"></div>
        <div className="acc-card"></div>
        <div className="acc-card"></div>
        <div className="top-light"></div>
      </motion.div>
    </div>
  );
}

export default Login;