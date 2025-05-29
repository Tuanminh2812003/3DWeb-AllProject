import React from "react";
import { Canvas } from "@react-three/fiber";
import ClaySculptor from "../../components/ClaySculptor";

function TestGom() {
  return (
    <Canvas camera={{ position: [1.5, 1, 2], fov: 40 }}>
      <ClaySculptor />
    </Canvas>
  );
}

export default TestGom;