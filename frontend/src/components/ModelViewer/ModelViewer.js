// src/components/ModelViewer/ModelViewer.js

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelector } from 'react-redux';

function Model({ modelPath }) {
  const geometry = useLoader(STLLoader, modelPath);
  const meshRef = useRef();

  // Access material properties from Redux
  const { color, metalness, roughness } = useSelector((state) => state.material);

  // Access transformation properties from Redux
  const position = useSelector((state) => state.transform.position);
  const rotation = useSelector((state) => state.transform.rotation);
  const scale = useSelector((state) => state.transform.scale);

  // Center the geometry
  useEffect(() => {
    if (geometry) {
      geometry.center(); // Centers the geometry at [0, 0, 0]
      if (!geometry.hasAttribute('normal')) {
        geometry.computeVertexNormals();
      }
    }
  }, [geometry]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      castShadow
      receiveShadow
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale.x, scale.y, scale.z]}
    >
      <meshStandardMaterial 
        color={color} 
        metalness={metalness} 
        roughness={roughness} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ModelViewer({ modelPath }) {
  // Reference for OrbitControls
  const orbitRef = useRef();

  // Access lock state from Redux
  const isLocked = useSelector((state) => state.transform.isLocked);

  return (
    <Canvas shadows style={{ background: 'white' }} className="flex-1">
      {/* Perspective Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={75} />

      {/* Lighting */}
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 10]} intensity={4} />
      <directionalLight position={[-10, -10, -10]} intensity={4} />
      <pointLight position={[0, 50, 0]} intensity={2.0} />

      {/* Group to manage position, rotation, and scale */}
      <group>
        <Model modelPath={modelPath} />
      </group>

      {/* OrbitControls */}
      <OrbitControls
        ref={orbitRef}
        enablePan={!isLocked}
        enableZoom={!isLocked}
        enableRotate={!isLocked}
        maxDistance={200}
        minDistance={25}
        autoRotate={false} // Disable auto-rotate
        zoomSpeed={0.5} // Adjust zoom speed
        panSpeed={0.5} // Adjust pan speed
        dampingFactor={0.1} // Smooth controls
        enableDamping={true}
      />
    </Canvas>
  );
}

export default ModelViewer;
