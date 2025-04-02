import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const RatingPage = ({ nameOrInitials, rating, onRatingChange }) => {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  
  useEffect(() => {
    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5dc); // Beige background
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);
    
    // Create a minimalistic geometry
    const geometry = new THREE.TorusKnotGeometry(2, 0.3, 128, 16);
    
    // Create a simple material
    const material = new THREE.MeshPhongMaterial({
      color: 0xd3c7a6, // Beige color
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Add a few subtle particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300; // Fewer particles for minimalism
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.01,
      color: 0xc2b280, // Darker beige for particles
      transparent: true,
      opacity: 0.3
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      torusKnot.rotation.x += 0.002;
      torusKnot.rotation.y += 0.003;
      particlesMesh.rotation.y += 0.0005;
      
      // Make torus size responsive to the rating but with a more subtle effect
      const scale = 0.7 + (rating / 100) * 0.7;
      torusKnot.scale.set(scale, scale, scale);
      
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
  }, [rating]);

  const getRatingText = () => {
    if (rating < 20) return "Barely any...";
    if (rating < 40) return "Just a little...";
    if (rating < 60) return "A moderate amount...";
    if (rating < 80) return "Quite a lot...";
    return "Absolutely ALL the shits!";
  };

  const handleStartOver = () => {
    navigate('/');
  };

  return (
    <div className="page">
      <div ref={mountRef} className="canvas-container"></div>
      <div className="content">
        <h1>Givashitometer</h1>
        <p>
          <span className="user-name">{nameOrInitials}</span>, how much do you give a shit about <span className="company-name">TrouveAI</span>?
        </p>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={rating}
            className="slider"
            onChange={(e) => onRatingChange(parseInt(e.target.value))}
          />
        </div>
        <div className="rating-label">{rating}% - {getRatingText()}</div>
        <button onClick={handleStartOver}>Start Over</button>
      </div>
    </div>
  );
};

export default RatingPage;