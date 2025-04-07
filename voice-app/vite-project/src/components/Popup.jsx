// src/components/Popup.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function Popup({ message, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Backdrop with blur */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />

      {/* Popup Card */}
      <motion.div
        className="relative p-8 rounded-2xl bg-gradient-to-b from-[rgba(41,41,41,0.9)] to-[rgba(25,25,25,0.95)] border border-[rgba(6,182,212,0.3)] shadow-2xl overflow-hidden"
        style={{ maxWidth: '450px', width: '90%' }}
        initial={{ scale: 0.7, y: 100, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.7, y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.5 }}
      >
        {/* Glow Effect Border */}
        <div
          className="absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.6), rgba(87, 83, 78, 0.4), rgba(6, 182, 212, 0.6))',
            backgroundSize: '200% 200%',
            animation: 'glowPulse 4s ease-in-out infinite',
          }}
        />

        {/* Content */}
        <h3
          className="text-2xl font-bold holo-text mb-6"
          style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}
        >
          {message}
        </h3>

        {/* Close Button */}
        <motion.button
          className="relative px-6 py-2 rounded-lg bg-gradient-to-r from-[rgba(6,182,212,0.6)] to-[rgba(87,83,78,0.6)] text-white font-semibold border border-[rgba(6,182,212,0.8)]"
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.6)',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          onClick={onClose}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
}