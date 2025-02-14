// import React, { useEffect, useRef } from "react";
// import { useLoader } from "@react-three/fiber";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { Box3, Vector3, Group } from "three";

// const ManequinLoader = ({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], onModelClick }) => {
//   const model = useLoader(GLTFLoader, modelPath);
//   const groupRef = useRef(); // Ref cho group chứa model

//   useEffect(() => {
//     if (model && groupRef.current) {
//       const boundingBox = new Box3().setFromObject(model.scene);
//       const center = new Vector3();
//       const size = new Vector3();

//       boundingBox.getCenter(center);
//       boundingBox.getSize(size);

//       const pivot = new Group();
//       pivot.add(model.scene);

//       model.scene.position.set(-center.x, -boundingBox.min.y, -center.z);

//       groupRef.current.clear();
//       groupRef.current.add(pivot);
//     }
//   }, [model]);

//   const handlePointerOver = (e) => {
//     document.body.style.cursor = 'pointer';
//   };
//   const handlePointerOut = (e) => {
//       document.body.style.cursor = 'default';
//   };

//   return (
//     <group
//       ref={groupRef}
//       onClick={onModelClick}
//       position={position}
//       rotation={rotation.map((angle) => (angle * Math.PI) / 180)}
//       scale={scale}
//       onPointerOver={handlePointerOver} 
//       onPointerOut={handlePointerOut}
//     />
//   );
// };

// export default ManequinLoader;

import React, { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box3, Vector3, Group } from "three";

const ManequinLoader = ({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], onModelClick }) => {
  const model = useLoader(GLTFLoader, modelPath);
  const groupRef = useRef(new Group()); // Ref giữ mannequin độc lập

  useEffect(() => {
    if (model && groupRef.current) {
      const object3D = model.scene.clone(); // Clone để tránh lỗi khi có nhiều mannequins
      const boundingBox = new Box3().setFromObject(object3D);
      const center = new Vector3();
      boundingBox.getCenter(center);

      // Đưa pivot xuống đáy model
      const minY = boundingBox.min.y;
      object3D.position.set(-center.x, -minY, -center.z);

      // Xóa model cũ và thêm model mới với pivot đúng
      groupRef.current.clear();
      groupRef.current.add(object3D);
    }
  }, [model]);

  // Hiệu ứng khi hover chuột
  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  return (
    <group
      ref={groupRef}
      onDoubleClick={onModelClick} // Double-click để thay đổi model
      position={position}
      rotation={rotation.map((angle) => (angle * Math.PI) / 180)}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
};

export default ManequinLoader;
