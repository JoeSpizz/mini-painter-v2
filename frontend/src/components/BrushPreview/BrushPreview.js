// src/components/BrushPreview/BrushPreview.js

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function BrushPreview({ position, brushSize }) {
  const previewRef = useRef();

  // Make the preview face the camera
  useFrame(({ camera }) => {
    if (previewRef.current) {
      previewRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <mesh ref={previewRef} position={position}>
      <circleGeometry args={[brushSize, 32]} />
      <meshBasicMaterial color={0xffffff} opacity={0.3} transparent depthTest={false} />
    </mesh>
  );
}

export default BrushPreview;
