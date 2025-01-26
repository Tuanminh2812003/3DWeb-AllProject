import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box3, Vector3 } from "three";

const ManequinLoader = ({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0], onModelClick }) => {
  const model = useLoader(GLTFLoader, modelPath);

  useEffect(() => {
    if (model) {
      const boundingBox = new Box3().setFromObject(model.scene);
      const center = new Vector3();
      const size = new Vector3();

      boundingBox.getCenter(center);
      boundingBox.getSize(size);

      // Tính điểm dưới cùng thấp nhất của model
      const minPoint = boundingBox.min;

      // Dịch chuyển model sao cho điểm thấp nhất nằm ở gốc tọa độ (0, 0, 0)
      model.scene.position.sub(center); // Đưa tâm model về gốc
      model.scene.position.y -= size.y / 2; // Căn chỉnh điểm thấp nhất
    }
  }, [model]);

  return (
    <group
      onClick={onModelClick}
      position={position} // Vị trí do component cha truyền vào
      rotation={rotation.map((angle) => (angle * Math.PI) / 180)} // Đổi từ độ sang radian
    >
      {model && <primitive object={model.scene} />}
    </group>
  );
};

export default ManequinLoader;
