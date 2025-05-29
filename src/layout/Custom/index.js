import React, { useState, lazy, Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

import { CameraProvider } from "../../helpers/CameraContext";
import Movement2 from "../../action/Movement2";
import CameraClick from "../../action/CameraClick";
import ResizeHandler from "../../action/ResizeElement2";
import ManequinLoader from "../../components/ManequinLoader2";
import ModelEditorPanel from "../../components/ModelEditorPanel";
import { MdOutlineZoomOutMap, MdOutlineZoomInMap } from "react-icons/md";

const ModelLoader2 = lazy(() => import("../../components/ModelLoader2"));

export default function Custom() {
  /* ---------- dữ liệu mannequin ---------- */
  const [mannequins, setMannequins] = useState([
    { id: 1, modelPath: "/NTST/Question 1.glb", position: [6.6, 1.2, 3.4], rotation: [0,0,0], scale:[1,1,1] },
    { id: 2, modelPath: "/NTST/Question 1.glb", position: [5.1, 1.2, 4.8], rotation: [0,0,0], scale:[1,1,1] },
  ]);

  /* ---------- edit mode ---------- */
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  /* wrapper ref để bật/tắt pointer-events */
  const canvasWrapperRef = useRef(null);
  useEffect(() => {
    if (canvasWrapperRef.current) {
      canvasWrapperRef.current.style.pointerEvents = editMode ? "none" : "auto";
    }
  }, [editMode]);

  /* ---------- camera helpers ---------- */
  const [clicked, setClicked] = useState(false);
  const cameraPosition = new THREE.Vector3(10, 1.6, 0);
  const cameraRotation = new THREE.Euler(0, Math.PI / 2, 0);

  /* ---------- handlers ---------- */
  const handleModelClick = (id) => editMode && setEditingId(id);

  const updateTransform = (id, data) =>
    setMannequins((p) => p.map((m) => (m.id === id ? { ...m, ...data } : m)));

  const handleImportGlb = (id, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMannequins((p) => p.map((m) => (m.id === id ? { ...m, modelPath: url } : m)));
  };

  /* ---------- fullscreen ---------- */
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  const toggleFs = () =>
    !document.fullscreenElement
      ? document.documentElement.requestFullscreen()
      : document.exitFullscreen?.();

  /* ---------- JSX ---------- */
  return (
    <CameraProvider>
      {/* nút Edit */}
      <button
        style={{ position:"fixed",top:20,right:20,zIndex:9999,padding:"8px 14px",
                 border:"none",borderRadius:6,background:editMode?"#e53935":"#4caf50",
                 color:"#fff",cursor:"pointer"}}
        onClick={() => { setEditMode((p) => !p); setEditingId(null); }}
      >
        {editMode ? "Thoát chỉnh sửa" : "Chỉnh sửa"}
      </button>

      {/* nút fullscreen */}
      <button
        style={{ position:"fixed",top:20,left:20,zIndex:9999,padding:"6px 8px",
                 border:"none",borderRadius:6,background:"#607d8b",color:"#fff"}}
        onClick={toggleFs}
      >
        {isFs ? <MdOutlineZoomInMap/> : <MdOutlineZoomOutMap/>}
      </button>

      {/* ---------- Canvas wrapper ---------- */}
      <div ref={canvasWrapperRef} style={{ width:"100vw", height:"100vh" }}>
        <Canvas
          dpr={[1,2]}
          shadows
          gl={{ antialias:true, toneMapping:THREE.ACESFilmicToneMapping }}
        >
          <Environment files="/hdri.jpg" background />
          <Suspense fallback={null}>
            <ModelLoader2
              path="/Custom/Virtual Gallery v1-custom.glb"
              position={[0,0,0]} rotation={[0,0,0]} scale={[1,1,1]}
              clickable={false}
            />

            {mannequins.map(
              (m) =>
                m.modelPath && (
                  <ManequinLoader
                    key={m.id}
                    {...m}
                    onModelClick={() => handleModelClick(m.id)}
                  />
                )
            )}

            <CameraClick
              targetPosition={[0,0,0]}
              targetRotation={[0,0,0]}
              clicked={clicked}
              setClicked={setClicked}
              updateCameraState={() => {}}
            />

            {!editMode && (
              <Movement2
                cameraPosition={cameraPosition}
                cameraRotation={cameraRotation}
                clicked={clicked}
                freeExploration
              />
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* ---------- Panel Edit ---------- */}
      <ModelEditorPanel
        visible={editMode && editingId !== null}
        mannequin={mannequins.find((m) => m.id === editingId)}
        onChange={(d) => updateTransform(editingId, d)}
        onImport={(f) => handleImportGlb(editingId, f)}
        onClose={() => setEditingId(null)}
      />

      {/* responsive helper */}
      <ResizeHandler updateItemsForScreenSize={() => {}} />
    </CameraProvider>
  );
}
