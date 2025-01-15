import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { MathUtils } from 'three'; // Correct import for PI

const Model = () => {
  const { scene } = useGLTF('/car.glb');
  const modelRef = useRef();

  return <primitive ref={modelRef} object={scene} />;
};

const ThreeDModel = () => {
  return (
    <div className="w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ThreeDModel;
