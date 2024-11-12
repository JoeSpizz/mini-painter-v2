// src/components/ModelViewer/ModelViewer.js

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { DoubleSide, Color, Vector3 } from 'three';
import BrushPreview from '../BrushPreview/BrushPreview';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { RBush3D } from 'rbush-3d';
import throttle from 'lodash/throttle';

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
  const [rbushTree, setRbushTree] = useState(null);

  const tmpVertex = useMemo(() => new THREE.Vector3(), []);
  const inverseMatrix = useMemo(() => new THREE.Matrix4(), []);

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

  // Build RBush3D spatial index
  useEffect(() => {
    if (geometry) {
      try {
        const points = [];
        for (let i = 0; i < geometry.attributes.position.count; i++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i);
          points.push({
            minX: vertex.x,
            minY: vertex.y,
            minZ: vertex.z,
            maxX: vertex.x,
            maxY: vertex.y,
            maxZ: vertex.z,
            index: i,
          });
        }

        const tree = new RBush3D();
        tree.load(points);
        setRbushTree(tree);
      } catch (error) {
        console.error('Error building RBush3D spatial index:', error);
      }
    }
  }, [geometry]);

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

  // Update inverse matrix whenever mesh transformation changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.updateMatrixWorld();
      inverseMatrix.copy(meshRef.current.matrixWorld).invert();
    }
  }, [position, rotation, scale, inverseMatrix]);

  // Painting Function with Smooth Blending and Optimizations
  const paint = useCallback(
    (event) => {
      if (!isPaintMode) return;
      if (!meshRef.current) {
        console.warn('Mesh reference is not available.');
        return;
      }

      const intersectedGeometry = event.object.geometry;
      const colorAttribute = intersectedGeometry.attributes.color;

      if (rbushTree && colorAttribute) {
        const brushRadius = brushSize;
        const intersectPoint = event.point.clone();

        const localPoint = intersectPoint.applyMatrix4(inverseMatrix);

        const queryBox = {
          minX: localPoint.x - brushRadius,
          minY: localPoint.y - brushRadius,
          minZ: localPoint.z - brushRadius,
          maxX: localPoint.x + brushRadius,
          maxY: localPoint.y + brushRadius,
          maxZ: localPoint.z + brushRadius,
        };

        // Remove MAX_POINTS limit to allow large brush sizes
        const nearestPoints = rbushTree.search(queryBox);

        nearestPoints.forEach((point) => {
          const i = point.index;
          tmpVertex.fromBufferAttribute(intersectedGeometry.attributes.position, i);
          const distance = tmpVertex.distanceTo(localPoint);

          if (distance <= brushRadius) {
            const existingColor = new THREE.Color(
              colorAttribute.getX(i),
              colorAttribute.getY(i),
              colorAttribute.getZ(i)
            );

            const blendFactor = 1 - distance / brushRadius;
            const finalBlend = blendFactor * brushOpacity;

            existingColor.lerp(brushColor, finalBlend);

            colorAttribute.setXYZ(i, existingColor.r, existingColor.g, existingColor.b);
          }
        });

        colorAttribute.needsUpdate = true;
      }
    },
    [rbushTree, brushColor, brushOpacity, brushSize, inverseMatrix, isPaintMode, tmpVertex]
  );

  const throttledPaint = useMemo(
    () => throttle(paint, 30),
    [paint]
  );

  useEffect(() => {
    return () => {
      throttledPaint.cancel();
    };
  }, [throttledPaint]);

  const handlePointerDown = (event) => {
    if (!isPaintMode) return;
    setIsPainting(true);
    paint(event);
    event.stopPropagation();
  };

  const handlePointerMove = (event) => {
    if (!isPaintMode) return;
    if (isPainting) {
      throttledPaint(event);
    }
    setBrushPosition(event.point);
    event.stopPropagation();
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
      {isPaintMode && <BrushPreview position={brushPosition} brushSize={brushSize} />}
    </>
  );
}

export default ModelViewer;
