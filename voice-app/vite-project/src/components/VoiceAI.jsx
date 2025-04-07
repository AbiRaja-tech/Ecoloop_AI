// VoiceAI.jsx
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const VoiceAI = ({ user }) => {
  const mountRef = useRef(null);
  const [state, setState] = useState('idle'); // idle, listening, processing, speaking
  const [isActive, setIsActive] = useState(false);
  const sphereRef = useRef(null);
  const animationRef = useRef(null);

  // Gradient colors for different states
  const colors = {
    idle: { start: '#6666FF', end: '#333399' },
    listening: { start: '#00FF99', end: '#006633' },
    processing: { start: '#FFCC00', end: '#996600' },
    speaking: { start: '#FF3366', end: '#991133' }
  };

  useEffect(() => {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    const size = 300;
    renderer.setSize(size, size);
    mountRef.current.appendChild(renderer.domElement);

    // Create sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;
    scene.add(sphere);

    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 3;

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Update gradient based on state
      const gradient = colors[state];
      material.color.setStyle(gradient.start);
      material.emissive.setStyle(gradient.end);
      
      // Pulse effect
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      sphere.scale.set(scale, scale, scale);
      sphere.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [state]);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setState('listening');
    recognition.onresult = (event) => {
      setState('processing');
      const command = event.results[0][0].transcript;
      processCommand(command);
    };
    recognition.onend = () => {
      if (state === 'listening') setState('idle');
    };

    if (isActive) {
      recognition.start();
    }

    return () => recognition.stop();
  }, [isActive]);

  const processCommand = (command) => {
    setTimeout(() => {
      setState('speaking');
      const utterance = new SpeechSynthesisUtterance(
        `Hello ${user.name}, you said: ${command}. How can I assist you today?`
      );
      utterance.onend = () => {
        setState('idle');
        setIsActive(false);
      };
      window.speechSynthesis.speak(utterance);
    }, 1000);
  };

  const handleTouch = () => {
    setIsActive(!isActive);
  };

  return (
    <motion.div
      className="holo-card w-[20rem] h-[24rem] flex flex-col items-center justify-center"
      style={{ '--glow-color': `rgba(${isActive ? '0,255,153' : '255,255,255'}, 0.6)` }}
      onClick={handleTouch}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={mountRef} className="relative w-[300px] h-[300px]" />
      <div className="card-title mt-4 capitalize">{state} Mode</div>
      <div className="card-text">
        {isActive ? 'Tap to deactivate' : 'Tap to activate Voice AI'}
      </div>
    </motion.div>
  );
};

export default VoiceAI;