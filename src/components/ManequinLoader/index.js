import React, { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box3, Vector3, Group } from "three";

const ManequinLoader = ({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], onModelClick }) => {
  const model = useLoader(GLTFLoader, modelPath);
  const groupRef = useRef(); // Ref cho group chứa model

  useEffect(() => {
    if (model && groupRef.current) {
      const boundingBox = new Box3().setFromObject(model.scene);
      const center = new Vector3();
      const size = new Vector3();

      boundingBox.getCenter(center);
      boundingBox.getSize(size);

      const pivot = new Group();
      pivot.add(model.scene);

      model.scene.position.set(-center.x, -boundingBox.min.y, -center.z);

      groupRef.current.clear();
      groupRef.current.add(pivot);
    }
  }, [model]);

  const handlePointerOver = (e) => {
    document.body.style.cursor = 'pointer';
  };
  const handlePointerOut = (e) => {
      document.body.style.cursor = 'default';
  };

  return (
    <group
      ref={groupRef}
      onClick={onModelClick}
      position={position}
      rotation={rotation.map((angle) => (angle * Math.PI) / 180)}
      scale={scale}
      onPointerOver={handlePointerOver} 
      onPointerOut={handlePointerOut}
    />
  );
};

export default ManequinLoader;

// import React, { useEffect, useRef } from "react";
// import { useLoader } from "@react-three/fiber";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { Box3, Vector3, Group } from "three";

// const ManequinLoader = ({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], onModelClick }) => {
//   const model = useLoader(GLTFLoader, modelPath);
//   const groupRef = useRef(); // Group giữ model với pivot chính xác

//   useEffect(() => {
//     if (model && groupRef.current) {
//       const object3D = model.scene;
//       const boundingBox = new Box3().setFromObject(object3D);
//       const center = new Vector3();
//       boundingBox.getCenter(center);

//       // Đưa model về đúng tâm để không bị lệch khi scale
//       object3D.position.sub(center);

//       // Xóa model cũ và thêm vào group mới để giữ đúng vị trí
//       groupRef.current.clear();
//       groupRef.current.add(object3D);
//     }
//   }, [model]); // Chạy lại khi model thay đổi

//   return (
//     <group
//       ref={groupRef}
//       position={position} // Giữ nguyên vị trí model
//       rotation={rotation.map((angle) => (angle * Math.PI) / 180)} // Chuyển rotation từ độ sang radian
//       scale={scale} // Chỉnh scale mà không ảnh hưởng vị trí
//       onDoubleClick={onModelClick} // Double-click để mở file picker
//     />
//   );
// };

// export default ManequinLoader;
