import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export default function ClaySculptor() {
  const meshRef = useRef();
  const { viewport } = useThree();
  const [geometry, setGeometry] = useState(null);

  // Profile spline cho LatheGeometry
  const points = useMemo(() => {
    return [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.4, 0.2),
      new THREE.Vector2(0.35, 0.4),
      new THREE.Vector2(0.3, 0.6),
      new THREE.Vector2(0.2, 0.8),
      new THREE.Vector2(0, 1),
    ];
  }, []);

  // Tạo geometry
  const lathe = useMemo(() => {
    const geo = new THREE.LatheGeometry(points, 100);
    geo.computeVertexNormals();
    setGeometry(geo);
    return geo;
  }, [points]);

  // Bàn xoay tự xoay
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Click để nặn lõm
  const onClick = (e) => {
    e.stopPropagation();
    const mesh = meshRef.current;
    const face = e.face;
    const geom = mesh.geometry;

    const index = face.a; // chỉ cần 1 đỉnh là đủ

    // Lấy vị trí và làm lõm điểm đó (giảm x)
    const pos = geom.attributes.position;
    const x = pos.getX(index);
    const y = pos.getY(index);
    const z = pos.getZ(index);

    pos.setX(index, x * 0.92); // lõm vào 1 chút
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  };

  return (
    <>
      <OrbitControls enablePan={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />

      {geometry && (
        <mesh
          ref={meshRef}
          geometry={geometry}
          onClick={onClick}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#c49c73" roughness={0.9} />
        </mesh>
      )}
    </>
  );
}
