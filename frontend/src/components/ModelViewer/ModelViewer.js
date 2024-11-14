// src/components/ModelViewer/ModelViewer.js

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { DoubleSide, Color, Vector3 } from 'three';
import BrushPreview from '../BrushPreview/BrushPreview';
import { useSelector } from 'react-redux';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'; // Import directly without 'THREE.'
import * as THREE from 'three';
import { RBush3D } from 'rbush-3d';
import throttle from 'lodash/throttle';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelViewer = forwardRef(
  (
    {
      modelPath,
      modelType,
      brushColor,
      brushSize,
      brushOpacity,
      isPaintMode,
      onHistoryChange,
      onColorUsed, // **Receive Callback**
    },
    ref
  ) => {
    const meshRef = useRef();
    const [geometry, setGeometry] = useState(null);
    const [isGLTFWithColors, setIsGLTFWithColors] = useState(false);

    useEffect(() => {
      if (window.electron && window.electron.saveFile) {
        console.log("Electron saveFile is available");
      } else {
        console.error("Electron saveFile is not available");
      }
    }, []);
    
    useEffect(() => {
      let loader;
      if (modelType === 'stl') {
        loader = new STLLoader();
        loader.load(modelPath, (geom) => {
          geom.center();
          geom.computeVertexNormals();
          geom.computeBoundingSphere();  // Compute bounding volumes
          geom.computeBoundingBox();
          if (geom.boundingSphere) {
            setGeometry(geom);
          } else {
            console.warn("Bounding sphere not computed, geometry not set.");
          }
        });
      } else if (modelType === 'gltf') {
        loader = new GLTFLoader();
        loader.load(
          modelPath,
          (gltf) => {
            const child = gltf.scene.children[0];
            if (child.geometry) {
              const geom = child.geometry;
              geom.computeBoundingSphere();
              geom.computeBoundingBox();
              setGeometry(geom);
              setIsGLTFWithColors(geom.hasAttribute('color')); // Set flag based on vertex colors
            }
          },
          undefined,
          (error) => console.error("GLTF loading error:", error)
        );
      }
    }, [modelPath, modelType]);

    // Material Properties from Redux
    const { color, metalness, roughness } = useSelector(
      (state) => state.material
    );

    // Transformation Properties from Redux
    const position = useSelector((state) => state.transform.position);
    const rotation = useSelector((state) => state.transform.rotation);
    const scale = useSelector((state) => state.transform.scale);

    const [brushPosition, setBrushPosition] = useState(new Vector3());
    const [isPainting, setIsPainting] = useState(false);
    const [rbushTree, setRbushTree] = useState(null);

    const tmpVertex = useMemo(() => new THREE.Vector3(), []);
    const inverseMatrix = useMemo(() => new THREE.Matrix4(), []);

    // History Stacks
    const history = useRef([]);
    const redoHistory = useRef([]);
    const currentAction = useRef(null);

    const triggerHistoryChange = useCallback(() => {
      if (onHistoryChange) {
        onHistoryChange(history.current.length > 0, redoHistory.current.length > 0);
      }
    }, [onHistoryChange]);

    useImperativeHandle(ref, () => ({
      undo: () => {
        if (history.current.length === 0) return;
        const lastAction = history.current.pop();
        if (lastAction && geometry && geometry.hasAttribute('color')) {
          const colorAttribute = geometry.attributes.color;
          lastAction.vertices.forEach(({ index, previousColor }) => {
            colorAttribute.setXYZ(index, previousColor.r, previousColor.g, previousColor.b);
          });
          colorAttribute.needsUpdate = true;
          redoHistory.current.push(lastAction);
          triggerHistoryChange();
          console.log('Undo performed:', lastAction);
        }
      },
      redo: () => {
        if (redoHistory.current.length === 0) return;
        const lastRedoAction = redoHistory.current.pop();
        if (lastRedoAction && geometry && geometry.hasAttribute('color')) {
          const colorAttribute = geometry.attributes.color;
          lastRedoAction.vertices.forEach(({ index, newColor }) => {
            colorAttribute.setXYZ(index, newColor.r, newColor.g, newColor.b);
          });
          colorAttribute.needsUpdate = true;
          history.current.push(lastRedoAction);
          triggerHistoryChange();
          console.log('Redo performed:', lastRedoAction);
        }
      },
      canUndo: () => history.current.length > 0,
      canRedo: () => redoHistory.current.length > 0,
      exportModel,
    }));

    useEffect(() => {
      if (geometry) {
        geometry.center();
        if (!geometry.hasAttribute('normal')) {
          geometry.computeVertexNormals();
        }
    
        // Initialize vertex colors only if they don't exist
        if (!geometry.hasAttribute('color')) {
          const colors = [];
          const defaultColor = new Color(color);
          for (let i = 0; i < geometry.attributes.position.count; i++) {
            colors.push(defaultColor.r, defaultColor.g, defaultColor.b);
          }
          geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
          );
          geometry.attributes.color.needsUpdate = true;
        }
      }
    }, [geometry, color]);

    // Build RBush3D spatial index
    useEffect(() => {
      if (geometry) {
        try {
          const points = [];
          for (let i = 0; i < geometry.attributes.position.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(
              geometry.attributes.position,
              i
            );
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
          console.log('RBush3D spatial index built with', points.length, 'points');
        } catch (error) {
          console.error('Error building RBush3D spatial index:', error);
        }
      }
    }, [geometry]);

    // Update vertex colors when material color changes
    useEffect(() => {
      if (geometry && geometry.hasAttribute('color') && !isGLTFWithColors) {
        const colors = geometry.attributes.color.array;
        const updatedColor = new Color(color);
        for (let i = 0; i < colors.length; i += 3) {
          colors[i] = updatedColor.r;
          colors[i + 1] = updatedColor.g;
          colors[i + 2] = updatedColor.b;
        }
        geometry.attributes.color.needsUpdate = true;
        console.log('Material color updated for all vertices');
      }
    }, [color, geometry, isGLTFWithColors]);

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

          const nearestPoints = rbushTree.search(queryBox);

          nearestPoints.forEach((point) => {
            const i = point.index;
            tmpVertex.fromBufferAttribute(
              intersectedGeometry.attributes.position,
              i
            );
            const distance = tmpVertex.distanceTo(localPoint);

            if (distance <= brushRadius) {
              const existingColor = new THREE.Color(
                colorAttribute.getX(i),
                colorAttribute.getY(i),
                colorAttribute.getZ(i)
              );

              // Record previous and new color for undo/redo
              if (
                currentAction.current &&
                !currentAction.current.vertexSet.has(i)
              ) {
                const previousColor = existingColor.clone();
                const blendedColor = existingColor.clone().lerp(
                  brushColor,
                  (1 - distance / brushRadius) * brushOpacity
                );
                currentAction.current.vertices.push({
                  index: i,
                  previousColor,
                  newColor: blendedColor.clone(),
                });
                currentAction.current.vertexSet.add(i);
              }

              // Apply blending
              existingColor.lerp(
                brushColor,
                (1 - distance / brushRadius) * brushOpacity
              );

              colorAttribute.setXYZ(i, existingColor.r, existingColor.g, existingColor.b);
            }
          });

          colorAttribute.needsUpdate = true;
          console.log('Paint applied:', nearestPoints.length, 'vertices');

          // **New: Invoke onColorUsed after painting**
          if (onColorUsed) {
            onColorUsed(brushColor);
          }
        }
      },
      [rbushTree, brushColor, brushOpacity, brushSize, inverseMatrix, isPaintMode, tmpVertex, onColorUsed]
    );

    const throttledPaint = useMemo(() => throttle(paint, 30), [paint]);

    useEffect(() => {
      return () => {
        throttledPaint.cancel();
      };
    }, [throttledPaint]);

    // Event Handlers
    const handlePointerDown = (event) => {
      if (!isPaintMode) return;
      setIsPainting(true);
      // Initialize a new action
      currentAction.current = { vertices: [], vertexSet: new Set() };
      paint(event);
      // Clear redo history on new action
      redoHistory.current = [];
      triggerHistoryChange(); // Update App.js immediately after clearing redo
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
      if (isPainting && currentAction.current && currentAction.current.vertices.length > 0) {
        history.current.push({
          vertices: currentAction.current.vertices.map(v => ({
            index: v.index,
            previousColor: v.previousColor.clone(),
            newColor: v.newColor.clone(),
          })),
        });
        currentAction.current = null;
        triggerHistoryChange(); // Update App.js immediately after pushing to history
        console.log('Action pushed to history:', history.current[history.current.length - 1]);
      }
      setIsPainting(false);
    };


    // src/components/ModelViewer/ModelViewer.js

    const exportModel = (filePath) => {
      console.log("exportModel called with path:", filePath);
      const exporter = new GLTFExporter();
      exporter.parse(meshRef.current, async (gltf) => {
        const data = JSON.stringify(gltf);
        await window.electron.saveFile(filePath, data);
      });
    };

    return geometry && geometry.boundingSphere ? (
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
            color={new Color(color)}
            side={DoubleSide}
          />

        </mesh>
        {isPaintMode && <BrushPreview position={brushPosition} brushSize={brushSize} />}
      </>
    ) : null;

        }
      );

export default ModelViewer;
