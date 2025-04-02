import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const RatingPage = ({ nameOrInitials, rating, onRatingChange }) => {
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
    
    // Create a rotating torus
    const geometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
    
    // Create gradient material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color(0xff0099) },
        colorB: { value: new THREE.Color(0x493240) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorA;
        uniform vec3 colorB;
        varying vec2 vUv;
        
        void main() {
          vec3 color = mix(colorA, colorB, vUv.x + sin(time * 0.5) * 0.5);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      wireframe: true
    });
    
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);
    
    // Add some particles for depth
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Animation
    let time = 0;
    const clock = new THREE.Clock();
    
    const animate = () => {
      time += clock.getDelta();
      material.uniforms.time.value = time;
      
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;
      particlesMesh.rotation.y += 0.001;
      
      // Make torus size responsive to the rating
      const scale = 0.5 + (rating / 100) * 1.5;
      torus.scale.set(scale, scale, scale);
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
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