import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

export default function ModelEditorPanel({
  visible,
  mannequin,
  onChange,
  onImport,
  onClose,
}) {
  // Khởi tạo local state từ mannequin mỗi khi đổi id
  const initial = useMemo(() => {
    if (mannequin) {
      return {
        pos: [...mannequin.position],
        rot: mannequin.rotation.map((r) => THREE.MathUtils.radToDeg(r)),
        scl: [...mannequin.scale],
      };
    }
    return { pos: [0, 0, 0], rot: [0, 0, 0], scl: [1, 1, 1] };
  }, [mannequin?.id]);

  const [local, setLocal] = useState(initial);
  // Cập nhật lại khi đổi mannequin
  useEffect(() => {
    setLocal(initial);
  }, [initial]);

  // Nếu không hiển thị hoặc chưa có mannequin, không render gì
  if (!visible || !mannequin) return null;

  // Handler khi thay đổi input
  const change = (group, index, value) => {
    setLocal((prev) => {
      const next = { ...prev };
      next[group][index] = parseFloat(value) || 0;
      return next;
    });
  };

  // Component dòng XYZ
  const Row = ({ label, group, step = 0.01 }) => (
    <div className="row">
      <span>{label}</span>
      {["X", "Y", "Z"].map((axis, i) => (
        <input
          key={axis}
          type="number"
          step={step}
          value={local[group][i]}
          onChange={(e) => change(group, i, e.target.value)}
        />
      ))}
    </div>
  );

  // JSX của panel
  const panel = (
    <div className="model-editor">
      <h4>Chỉnh mannequin #{mannequin.id}</h4>

      <Row label="Position" group="pos" />
      <Row label="Rotation (°)" group="rot" />
      <Row label="Scale" group="scl" step={0.1} />

      <label className="import-btn">
        Thay model (GLB)
        <input
          type="file"
          accept=".glb"
          style={{ display: "none" }}
          onChange={(e) => e.target.files[0] && onImport(e.target.files[0])}
        />
      </label>

      <button
        className="save-btn"
        onClick={() => {
          // Chỉ gọi onChange khi nhấn Lưu
          onChange({
            position: local.pos,
            rotation: local.rot.map((d) => THREE.MathUtils.degToRad(d)),
            scale: local.scl,
          });
          onClose();
        }}
      >
        Lưu
      </button>
    </div>
  );

  // Portal ra ngoài <body> để không ảnh hưởng pointer-events của canvas
  return createPortal(panel, document.body);
}
