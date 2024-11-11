// src/components/ModelViewer/ModelViewer.js

import React, { useRef, useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { DoubleSide, Color, Vector3 } from 'three';
import BrushPreview from '../BrushPreview/BrushPreview';
import { useSelector } from 'react-redux';
import * as THREE from 'three';

function ModelViewer({ modelPath, brushColor, brushSize, brushOpacity, isPaintMode }) {
  const geometry = useLoader(STLLoader, modelPath);
  const meshRef = useRef();

  // Material Properties from Redux
  const { color, metalness, roughness } = useSelector((state) => state.material);

  // Transformation Properties from Redux
  const position = useSelector((state) => state.transform.position);
  const rotation = useSelector((state) => state.transform.rotation);
  const scale = useSelector((state) => state.transform.scale);

  const [brushPosition, setBrushPosition] = useState(new Vector3());
  const [isPainting, setIsPainting] = useState(false);

  // Initialize vertex colors
  useEffect(() => {
    if (geometry) {
      geometry.center();
      if (!geometry.hasAttribute('normal')) {
        geometry.computeVertexNormals();
      }

      if (!geometry.hasAttribute('color')) {
        const colors = [];
        const defaultColor = new Color(color);
        for (let i = 0; i < geometry.attributes.position.count; i++) {
          colors.push(defaultColor.r, defaultColor.g, defaultColor.b);
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      }
      geometry.attributes.color.needsUpdate = true;
    }
  }, [geometry, color]);

  // Update vertex colors when material color changes
  useEffect(() => {
    if (geometry && geometry.hasAttribute('color')) {
      const colors = geometry.attributes.color.array;
      const updatedColor = new Color(color);
      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = updatedColor.r;
        colors[i + 1] = updatedColor.g;
        colors[i + 2] = updatedColor.b;
      }
      geometry.attributes.color.needsUpdate = true;
    }
  }, [color, geometry]);

  // Painting Function with Smooth Blending
  const paint = (event) => {
    const intersectedGeometry = event.object.geometry;
    const colorAttribute = intersectedGeometry.attributes.color;

    if (intersectedGeometry && colorAttribute) {
      const brushRadius = brushSize;

      const intersectPoint = event.point; // Intersection point in 3D space

      for (let i = 0; i < intersectedGeometry.attributes.position.count; i++) {
        const vertex = new Vector3()
          .fromBufferAttribute(intersectedGeometry.attributes.position, i)
          .applyMatrix4(event.object.matrixWorld);
        const distance = vertex.distanceTo(intersectPoint);

        if (distance <= brushRadius) {

          // Existing color
          const existingColor = new Color(
            colorAttribute.getX(i),
            colorAttribute.getY(i),
            colorAttribute.getZ(i)
          );

          // Blend colors for smooth edges
          existingColor.lerp(brushColor, brushOpacity); // Adjust blending factor as needed

          colorAttribute.setXYZ(i, existingColor.r, existingColor.g, existingColor.b);
        }
      }
      colorAttribute.needsUpdate = true;
    }
  };

  // Event Handlers
  const handlePointerDown = (event) => {
    if (!isPaintMode) return;
    setIsPainting(true);
    paint(event);
  };

  const handlePointerMove = (event) => {
    if (!isPaintMode) return;
    if (isPainting) {
      paint(event);
    }

    // Update Brush Preview
    setBrushPosition(event.point);
  };

  const handlePointerUp = () => {
    setIsPainting(false);
  };

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        castShadow
        receiveShadow
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={[scale.x, scale.y, scale.z]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <meshStandardMaterial
          vertexColors={true}
          metalness={metalness}
          roughness={roughness}
          side={DoubleSide}
        />
      </mesh>

      {/* Brush Preview */}
      {isPaintMode && (
        <BrushPreview position={brushPosition} brushSize={brushSize} />
      )}
    </>
  );
}

export default ModelViewer;
