import React, { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Group, Box3, Vector3 } from "three";

/**
 * Hiển thị mannequin (GLB) + giữ pivot dưới đáy.
 * Giả định modelPath LUÔN là chuỗi hợp lệ → useLoader an toàn.
 */
export default function ManequinLoader({
  modelPath,                   // luôn string khác "" khi component được mount
  position  = [0, 0, 0],
  rotation  = [0, 0, 0],       // radian
  scale     = [1, 1, 1],
  onModelClick,
}) {
  /* React-Three Fiber loader */
  const gltf     = useLoader(GLTFLoader, modelPath);
  const groupRef = useRef(new Group());

  /* canh pivot: đặt gốc tọa độ dưới đáy model */
  useEffect(() => {
    const inst   = gltf.scene.clone();
    const bbox   = new Box3().setFromObject(inst);
    const center = new Vector3();
    bbox.getCenter(center);
    inst.position.set(-center.x, -bbox.min.y, -center.z);

    groupRef.current.clear();
    groupRef.current.add(inst);
  }, [gltf]);

  /* cập nhật transform theo props */
  useFrame(() => {
    const g = groupRef.current;
    if (g) {
      g.position.set(...position);
      g.rotation.set(...rotation);
      g.scale.set(...scale);
    }
  });

  /* cursor + click */
  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onModelClick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={()  => (document.body.style.cursor = "default")}
    />
  );
}
