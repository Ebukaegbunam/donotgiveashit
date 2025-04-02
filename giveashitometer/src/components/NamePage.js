import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const NamePage = ({ onSubmit }) => {
  const [nameOrInitials, setNameOrInitials] = useState('');
  const navigate = useNavigate();
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);
    
    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xff0099,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add light
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      currentMount.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameOrInitials.trim()) {
      onSubmit(nameOrInitials);
      navigate('/rating');
    }
  };

  return (
    <div className="page">
      <div ref={mountRef} className="canvas-container"></div>
      <div className="content">
        <h1>Givashitometer</h1>
        <p>Enter your name or initials to see how much you give a shit about TrouveAI</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nameOrInitials}
            onChange={(e) => setNameOrInitials(e.target.value)}
            placeholder="Your name or initials"
            required
          />
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default NamePage;