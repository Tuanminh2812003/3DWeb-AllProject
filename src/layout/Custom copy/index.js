import React, {
  useState,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useParams } from "react-router-dom";

// camera và move
import { CameraProvider } from "../../helpers/CameraContext";
import Movement from "../../action/Movement/index";
import Movement2 from "../../action/Movement2/index";

import CameraClick from "../../action/CameraClick";
import { Vector3, Euler } from "three";

// môi trường và model
import ModelLoaderWithVideo from "../../components/ModelLoaderWithVideo";
import ModelAnimated2 from "../../components/ModelAnimated2";
import ManequinLoader2 from "../../components/ManequinLoader";

import PictureFrame from "../../components/PictureFrame"; // hình ảnh
import ResizeHandler from "../../action/ResizeElement2"; // responsive model
import Minimap from "../../components/Minimap";

import Particles from "./../../components/Particles/index";

// pop up
import ModelPopup from "../../components/ModelPopup";
import PopUpHowToMove from "../../components/PopUpHowToMove";
import PopUpAboutTheExhibition from "../../components/PopUpAboutTheExhibition";
import PopUpListModel from "../../components/PopUpListModel";
import PopUpUpdate from "../../components/PopUpUpdate";

// icon
import { MdOutlineZoomOutMap } from "react-icons/md";
import { MdOutlineZoomInMap } from "react-icons/md";
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { RiDragMoveFill } from "react-icons/ri";
import { SiAwesomelists } from "react-icons/si";
import { PiListStarFill } from "react-icons/pi";
import { BsNewspaper } from "react-icons/bs";
import { MdSkipNext } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

import { Environment } from "@react-three/drei";

import PuzzleGame from "../GamePuzzle";

const ModelLoader2 = lazy(() => import("../../components/ModelLoader2"));

// Extend THREE with custom geometries
extend({ PlaneGeometry: THREE.PlaneGeometry, BoxGeometry: THREE.BoxGeometry });

function Custom() {
  const { prop } = useParams();
  const [mannequins, setMannequins] = useState([
    {
      id: 1,
      modelPath: "/NTST/Question 1.glb",
      position: [6.58, 1.2, 3.4],
      scale: [1, 1, 1],
    },
    {
      id: 2,
      modelPath: "/NTST/Question 1.glb",
      position: [5.1, 1.25, 4.8],
      scale: [1, 1, 1],
    },
    {
      id: 3,
      modelPath: "/NTST/Question 1.glb",
      position: [3.7, 1.2, 6.3],
      scale: [1, 1, 1],
    },
	{
		id: 4,
		modelPath: "/NTST/Question 1.glb",
		position: [2.5,0.25,0],
		scale: [1, 1, 1],
	  },
  ]);
  const selectedMannequinId = useRef(null);
  // Memo hóa các model
  const modelsConfig = useMemo(
    () => [
      {
        path: "/Custom/Virtual Gallery v1-custom.glb",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        clickable: false,
      },
    ],
    []
  );

  // mảng items các bức tranh để làm tour
  const [items, setItems] = useState([
    // Your items here...
  ]);
  // mảng items các bức tranh để làm tour

  const [setUploadedModelPath] = useState("/NTST/Question 1.glb");
  const [modelPath, setModelPath] = useState("/NTST/Question 1.glb"); // Đường dẫn model mặc định
  const [modelPosition, setModelPosition] = useState([3.04, 0, 3.69]); // Position mặc định
  const [modelRotation, setModelRotation] = useState([0, 0, 0]); // Rotation mặc định
  // const [modelScale, setModelScale] = useState([1, 1, 1]);
  const inputRef = useRef();

  // const [previewModel, setPreviewModel] = useState(null); // Model tạm thời để preview
  // const [previewScale, setPreviewScale] = useState([1, 1, 1]); // Scale tạm thời của model preview
  // const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // KHAI BÁO
  // move
  const [controlMode, setControlMode] = useState("user"); // "user" hoặc "overview"
  // move

  //audio
  const [introAudio, setIntroAudio] = useState(null);
  const [introActive, setIntroActive] = useState(false); // <-- Added state for intro phase
  const [introPausedTime, setIntroPausedTime] = useState(0); // Thời gian đã phát của intro audio
  const [currentAudio, setCurrentAudio] = useState(null); // Để lưu lại audio hiện tại khi pause
  //audio

  // click và các chức năng liên quan
  const [clicked, setClicked] = useState(false);
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [cameraPosition, setCameraPosition] = useState(new Vector3(10, 1.6, 0));
  const [cameraRotation, setCameraRotation] = useState(
    new Euler(0, Math.PI / 2, 0)
  );
  const [showDetailsPrompt, setShowDetailsPrompt] = useState(false); // <-- Added state for details prompt
  const [promptTimeout, setPromptTimeout] = useState(null); // <-- Added state for prompt timeout
  const [showHowToMove, setShowHowToMove] = useState(true); // <-- Added state for how to move popup
  const [popupOpen, setPopupOpen] = useState(false); // <-- Added state for model popup
  // click và các chức năng liên quan

  // giao diện và respondsive
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [landscapePromptVisible, setLandscapePromptVisible] = useState(false);
  const [navToggle, setNavToggle] = useState(false);
  // giao diện và respondsive

  // pop up
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [popUpAboutTheExhibition, setPopUpAboutTheExhibition] = useState(false);
  const [popUpListModel, setPopUpListModel] = useState(false);
  const [popUpUpdate, setPopUpUpdate] = useState(false);
  // pop up

  //tour
  const [showCountdown, setShowCountdown] = useState(false);
  const countdownTimeout = useRef(null);
  const [tourActive, setTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [countdown, setCountdown] = useState(10); // Đặt mặc định là 10 giây
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [paused, setPaused] = useState(false); // Thêm trạng thái paused
  const [tourPopupOpen, setTourPopupOpen] = useState(false); // <-- Added state for tour popup
  const [freeExploration, setFreeExploration] = useState(true); // <-- Added state for free exploration
  //tour

  // HÀM
  // move
  const handleControl = (action, state) => {
    document.dispatchEvent(
      new CustomEvent("control", { detail: { action, state } })
    );
  };
  // move

  //   const handleModelClick = (position, rotation) => {
  //     setModelPosition(position);
  //     setModelRotation(rotation);
  //     console.log(position, rotation);

  //     inputRef.current.click(); // Mở file picker
  //   };
  const handleModelClick = (id) => {
    selectedMannequinId.current = id;
    inputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && selectedMannequinId.current !== null) {
      const objectURL = URL.createObjectURL(file);
      setMannequins((prev) =>
        prev.map((mannequin) =>
          mannequin.id === selectedMannequinId.current
            ? { ...mannequin, modelPath: objectURL }
            : mannequin
        )
      );
    }
  };
  const addMannequin = () => {
    setMannequins((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        modelPath: "/NTST/Manequin.glb",
        position: [Math.random() * 5, 0, Math.random() * 5], // Random vị trí tránh trùng
        scale: [1, 1, 1],
      },
    ]);
  };
  //   const handleFileChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const objectURL = URL.createObjectURL(file);
  //       setModelPath(objectURL);
  //       // setPreviewModel(objectURL);
  //       // setPreviewScale([1, 1, 1]);
  //       // setIsPreviewOpen(true);
  //     }
  //   };
  // const handleConfirmModel = () => {
  // 	setModelPath(previewModel); // Cập nhật model chính
  // 	setModelScale(previewScale); // Áp dụng scale đã chỉnh
  // 	setIsPreviewOpen(false); // Đóng popup
  // };

  // Khi người dùng hủy, đóng popup mà không thay đổi gì
  // const handleCancelModel = () => {
  // 	setIsPreviewOpen(false);
  // };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setUploadedModelPath(objectURL); // Cập nhật đường dẫn model mới
    }
  };

  // click và các chức năng liên quan
  const handlePictureClick = useCallback(
    (position, rotation, imageUrl, model, info, video) => {
      console.log("handlePictureClick called with position:", position);
      console.log("handlePictureClick called with rotation:", rotation);
      console.log("handlePictureClick called with imageUrl:", imageUrl);
      console.log("handlePictureClick called with model:", model);
      console.log("handlePictureClick called with info:", info);
      console.log("handlePictureClick called with video", video);

      const direction = new Vector3(0, 0, 22);
      const eulerRotation = new Euler(
        rotation[0] * (Math.PI / 180),
        rotation[1] * (Math.PI / 180),
        rotation[2] * (Math.PI / 180)
      );

      direction.applyEuler(eulerRotation);
      const newCameraPosition = [
        position[0] + direction.x,
        position[1] + direction.y,
        position[2] + direction.z,
      ];

      const newCameraRotation = [rotation[0], rotation[1], rotation[2]];

      setTargetPosition(newCameraPosition);
      setTargetRotation(newCameraRotation);
      setSelectedImageUrl(imageUrl);
      setSelectedModel(model);
      setSelectedInfo(info);
      setSelectedVideo(video);
      setClicked(true);
      setShowDetailsPrompt(true); // Hiển thị chi tiết prompt
      clearTimeout(promptTimeout); // Xóa timeout hiện tại nếu có
      setPromptTimeout(setTimeout(() => setShowDetailsPrompt(false), 5000)); // Ẩn prompt sau 5 giây
    },
    [tourIndex, tourActive]
  );

  const updateCameraState = (position, rotation) => {
    setCameraPosition(new Vector3(position.x, position.y, position.z));
    setCameraRotation(new Euler(rotation.x, rotation.y, rotation.z));
  };

  // hàm xử lý sự kiện hoàn tất di chuyển camera
  const handleCameraMoveComplete = () => {
    setClicked(false); // Reset clicked state after camera move complete
    if (tourActive) {
      setPopupOpen(true); // Tự động mở popup khi di chuyển đến bức tranh
    }
  };

  const handleListItemClick = (item) => {
    handlePictureClick(
      item.position,
      item.rotation,
      item.imageUrl,
      null,
      item.info
    );
    handleClosePopUpListModel();
  };
  //Tour
  const startTour = () => {
    setPaused(false);
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }

    if (introAudio) {
      introAudio.pause(); // Dừng intro audio nếu nó đang phát
      setIntroAudio(null); // Xóa đối tượng intro audio
    }

    setTourActive(true);
    setIntroActive(true); // <-- Set introActive to true
    setFreeExploration(false);
    setCountdown(300); // Đặt thời gian đếm ngược cho toàn bộ tour, ví dụ: 300 giây (5 phút)
    playIntroAudioAndMove();
  };

  const startFreeExploration = () => {
    setTourActive(false);
    setFreeExploration(true);
  };

  const moveToItem = (index) => {
    if (index < items.length) {
      const item = items[index];
      handlePictureClick(
        item.position,
        item.rotation,
        item.imageUrl,
        null,
        item.info,
        item.video
      );
      setTourIndex(index);
      // setTourPopupOpen(true);
    } else {
      endTour();
    }
  };

  const endTour = () => {
    setPaused(false);
    setTourActive(false);
    setTourIndex(0);
    setCountdown(0);
    setTourPopupOpen(false); // Ẩn popup tour
    setShowHowToMove(true); // Hiển thị popup HowToMove

    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }

    if (introAudio) {
      introAudio.pause(); // Dừng intro audio nếu nó đang phát
      setIntroAudio(null); // Xóa đối tượng intro audio
    }
  };

  // pauseTour function to pause the tour
  const pauseTour = () => {
    setPaused(true);
    setFreeExploration(true);

    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }

    if (introActive && introAudio) {
      introAudio.pause(); // Dừng intro audio
      setIntroPausedTime(introAudio.currentTime); // Lưu thời gian đã phát
    } else if (currentAudio) {
      currentAudio.pause(); // Dừng audio của tranh
    }
  };

  // continueTour function to continue the tour
  const continueTour = () => {
    setPaused(false);
    setFreeExploration(false);

    if (introActive && introAudio) {
      introAudio.currentTime = introPausedTime; // Tiếp tục từ thời gian đã tạm dừng
      introAudio.play();
    } else if (currentAudio) {
      currentAudio.play(); // Tiếp tục audio của tranh
    } else {
      moveToItem(tourIndex); // Di chuyển đến tranh hiện tại trong tour
    }

    let interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          endTour();
          return 0;
        }
      });
    }, 1000);
    setCountdownInterval(interval);
  };
  useEffect(() => {
    const handleMouseMove = () => {
      setShowCountdown(true);
      if (countdownTimeout.current) {
        clearTimeout(countdownTimeout.current);
      }
      countdownTimeout.current = setTimeout(() => {
        setShowCountdown(false);
      }, 1000); // Thời gian ẩn countdown sau 1 giây không có hoạt động chuột
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (countdownTimeout.current) {
        clearTimeout(countdownTimeout.current);
      }
    };
  }, []);
  //Tour

  // giao diện và respondsive
  // Chặn cuộn trang trên thiết bị di động
  useEffect(() => {
    const disableScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener("touchmove", disableScroll, { passive: false });

    return () => {
      window.removeEventListener("touchmove", disableScroll);
    };
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const navHandler = () => {
    setNavToggle((prevData) => !prevData);
  };

  const updateItemsForScreenSize = (newItems) => {
    setItems(newItems);
  };
  // giao diện và respondsive

  // pop up
  const handleClosePopup = () => {
    setPopupOpen(false);
    if (currentAudio) {
      currentAudio.pause(); // Dừng audio hiện tại
      setCurrentAudio(null); // Xóa đối tượng audio hiện tại
    }
    if (tourActive && !paused) {
      moveToItem(tourIndex + 1);
    }
  };

  const handleOpenInstructions = () => {
    setShowHowToMove(true);
  };
  const handleOpenPopUpUpdate = () => {
    setPopUpUpdate(true);
  };
  const handleClosePopUpUpdate = () => {
    setPopUpUpdate(false);
  };

  const handleClosePopUpAboutTheExhibition = () => {
    setPopUpAboutTheExhibition(false);
  };

  const handleOpenPopUpAboutTheExhibition = () => {
    setPopUpAboutTheExhibition(true);
  };

  const handleOpenPopUpListModel = () => {
    setPopUpListModel(true);
  };

  const handleClosePopUpListModel = () => {
    setPopUpListModel(false);
  };

  const handleCloseHowToMove = (mode) => {
    setShowHowToMove(false);
    if (mode === "free") {
      startFreeExploration();
    } else if (mode === "tour") {
      startTour();
    } else if (mode === "update") {
      setPopUpUpdate(true);
    }
  };
  // pop up

  // kiểm tra hướng màn hình
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.orientation === 90 || window.orientation === -90) {
        setLandscapePromptVisible(false);
      } else if (/Mobi|Android/i.test(navigator.userAgent)) {
        setLandscapePromptVisible(true);
      }
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    // kiểm tra hướng khi trang được tải
    handleOrientationChange();

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  const closeLandscapePrompt = () => {
    setLandscapePromptVisible(false);
  };

  // phát audio
  const playIntroAudioAndMove = () => {
    const audio = new Audio("/assets/Audio/intro.mp3");
    setIntroAudio(audio); // Lưu intro audio vào state
    audio.play();

    audio.onended = () => {
      setIntroActive(false); // <-- Set introActive to false
      startTourAfterIntro();
    };
  };

  const startTourAfterIntro = () => {
    setTourIndex(0);
    setFreeExploration(false);
    moveToItem(0);
  };

  const handleAudioEnded = () => {
    setCurrentAudio(null); // Xóa đối tượng audio hiện tại sau khi phát xong
    setPopupOpen(false);
    if (tourActive && !paused) {
      moveToItem(tourIndex + 1);
    }
  };

  // phát audio

  return (
    <>
      <CameraProvider>
        <div className="main">
          {/* Thông báo xoay màn hình */}
          {landscapePromptVisible && (
            <div id="landscape-prompt">
              <div className="landscape-prompt-content">
                <div class="iframe-container">
                  <iframe
                    src="https://giphy.com/embed/XXU2vaPVrnhV7ZAGpY"
                    className="gif-rotate-phone"
                  ></iframe>
                  <div class="iframe-overlay"></div>
                </div>

                <p>Rotate device for better experience</p>
              </div>
              <button onClick={closeLandscapePrompt}>✕</button>
            </div>
          )}
          {/* Thông báo xoay màn hình */}
          <Canvas
            dpr={[1, 2]}
            shadows
            gl={{
              toneMapping: THREE.ACESFilmicToneMapping,
              // colorSpace: THREE.LinearSRGBColorSpace, // Use this instead of `sRGBEncoding`
              antialias: true, // Sửa lại cú pháp ở đây
            }}
          >
            <Environment files="/hdri.jpg" background />
            <Suspense fallback={null}>
              {/* Môi trường */}

              {/* Render các ModelLoader từ mảng config */}
              {modelsConfig.map((modelProps, index) => (
                <ModelLoader2 key={index} {...modelProps} />
              ))}

              {/* <ModelInspector path="/assets/space2/untitled.glb" /> */}

              {/* <ManequinLoader
                modelPath={modelPath}
                position={modelPosition} // Truyền position từ state
                rotation={modelRotation} // Truyền rotation từ state
                onModelClick={() =>
                  handleModelClick(modelPosition, modelRotation)
                }
              /> */}
              {mannequins.map((mannequin) => (
                <ManequinLoader2
                  key={mannequin.id}
                  modelPath={mannequin.modelPath}
                  position={mannequin.position}
                  scale={mannequin.scale}
                  onModelClick={() => handleModelClick(mannequin.id)}
                />
              ))}

              <ambientLight intensity={2.5} />

              {/* Chiếu sáng các model cụ thể */}

              {/* Môi trường */}

              {/* item */}

              {/* item */}

              {/* Hàm bổ trợ */}
              <CameraClick
                targetPosition={targetPosition}
                targetRotation={targetRotation}
                clicked={clicked}
                setClicked={setClicked}
                onMoveComplete={handleCameraMoveComplete}
                updateCameraState={updateCameraState}
              />
              {/* Chuyển đổi bộ điều khiển dựa trên controlMode */}
              {controlMode === "user" && (
                <Movement2
                  cameraPosition={cameraPosition}
                  cameraRotation={cameraRotation}
                  clicked={clicked}
                  freeExploration={freeExploration}
                />
              )}

              {controlMode === "overview" && (
                <OrbitControls enableZoom={true} enableRotate={true} />
              )}
              {/* Hàm bổ trợ */}
              {/* <EffectComposer>
                                    <SSAO samples={31} radius={20} intensity={15} luminanceInfluence={0.6} />
                                    <DepthOfField focusDistance={0.015} focalLength={0.02} bokehScale={2} />
                                </EffectComposer> */}
              {/* bloom, vignette, color correction, noise, film grain, Lens Distortion / Chromatic Aberration, Glitch, God Rays (Light Shafts), Hue/Saturation, Tone Mapping, Outline, Tilt Shift, Bloom Selective */}
            </Suspense>
          </Canvas>
          <div className="control-mode-buttons">
            <button
              onClick={() => setControlMode("user")}
              style={{
                marginRight: "10px",
                padding: "10px",
                backgroundColor: controlMode === "user" ? "#4caf50" : "#f0f0f0",
                color: controlMode === "user" ? "white" : "black",
              }}
            >
              View người dùng
            </button>
            <button
              onClick={() => setControlMode("overview")}
              style={{
                padding: "10px",
                backgroundColor:
                  controlMode === "overview" ? "#4caf50" : "#f0f0f0",
                color: controlMode === "overview" ? "white" : "black",
              }}
            >
              View toàn bộ
            </button>
          </div>
          {/* Thanh sidebar */}
          <div className="sidebarMain">
            {/* <div className={`fullscreen_button ${navToggle ? 'fullscreen_button-change' : ""}`} onClick={handlePreviousItem}>
                            <MdSkipPrevious />
                        </div>
                        <div className={`fullscreen_button ${navToggle ? 'fullscreen_button-change' : ""}`} onClick={handleNextItem}>
                            <MdSkipNext />
                        </div> */}
            <div
              className={`fullscreen_button ${
                navToggle ? "fullscreen_button-change" : ""
              }`}
              onClick={handleOpenPopUpUpdate}
            >
              <MdSkipPrevious />
            </div>
            <div
              className={`fullscreen_button ${
                navToggle ? "fullscreen_button-change" : ""
              }`}
              onClick={handleOpenPopUpUpdate}
            >
              <MdSkipNext />
            </div>
            {!isFullscreen ? (
              <button
                className={`fullscreen_button ${
                  navToggle ? "fullscreen_button-change" : ""
                }`}
                onClick={handleFullscreenToggle}
              >
                <MdOutlineZoomOutMap />
              </button>
            ) : (
              <button
                className={`fullscreen_button ${
                  navToggle ? "fullscreen_button-change" : ""
                }`}
                onClick={handleFullscreenToggle}
              >
                <MdOutlineZoomInMap />
              </button>
            )}
            <div
              type="button"
              className={`sidebar ${navToggle ? "sidebar-change" : ""}`}
              onClick={navHandler}
            >
              <div className="sidebar-top"></div>
              <div className="sidebar-middle"></div>
              <div className="sidebar-bottom"></div>
            </div>
          </div>
          {navToggle ? (
            <div className="sidebarDisc">
              <div
                className="sidebarDisc__button"
                onClick={handleFullscreenToggle}
              >
                <div className="sidebarDisc__button__text">
                  Chế độ toàn màn hình
                </div>
                {!isFullscreen ? (
                  <button className={`fullscreen_button`}>
                    <MdOutlineZoomOutMap />
                  </button>
                ) : (
                  <button className={`fullscreen_button`}>
                    <MdOutlineZoomInMap />
                  </button>
                )}
              </div>
              <div
                className="sidebarDisc__button"
                onClick={handleOpenInstructions}
              >
                <div className="sidebarDisc__button__text">
                  Hướng dẫn di chuyển
                </div>
                <div className="sidebarDisc__button__btn">
                  <RiDragMoveFill />
                </div>
              </div>
              <div
                className="sidebarDisc__button"
                onClick={handleOpenPopUpUpdate}
              >
                <div className="sidebarDisc__button__text">
                  Bắt đầu tham quan
                </div>
                <div className="sidebarDisc__button__btn">
                  <SiAwesomelists />
                </div>
              </div>
              {/* <div className='sidebarDisc__button' onClick={startTour}>
                                <div className='sidebarDisc__button__text'>Start tour</div>
                                <div className='sidebarDisc__button__btn'><SiAwesomelists /></div>
                            </div> */}
              <div
                className="sidebarDisc__button"
                onClick={handleOpenPopUpListModel}
              >
                <div className="sidebarDisc__button__text">
                  Danh sách mẫu vật
                </div>
                <div className="sidebarDisc__button__btn">
                  <PiListStarFill />
                </div>
              </div>
              <div
                className="sidebarDisc__button"
                onClick={handleOpenPopUpAboutTheExhibition}
              >
                <div className="sidebarDisc__button__text">Về triển lãm</div>
                <div className="sidebarDisc__button__btn">
                  <BsNewspaper />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Thanh sidebar */}
          {/* Nút bấm di chuyển */}
          {freeExploration && (
            <div className="controler">
              <div className="top">
                <button
                  onMouseDown={() => handleControl("forward", true)}
                  onMouseUp={() => handleControl("forward", false)}
                  onTouchStart={() => handleControl("forward", true)}
                  onTouchEnd={() => handleControl("forward", false)}
                  className="controler__button"
                >
                  <FaCaretUp />
                </button>
              </div>
              <div className="bottom">
                <button
                  onMouseDown={() => handleControl("rotateLeft", true)}
                  onMouseUp={() => handleControl("rotateLeft", false)}
                  onTouchStart={() => handleControl("rotateLeft", true)}
                  onTouchEnd={() => handleControl("rotateLeft", false)}
                  className="controler__button"
                >
                  <FaCaretLeft />
                </button>
                <button
                  onMouseDown={() => handleControl("backward", true)}
                  onMouseUp={() => handleControl("backward", false)}
                  onTouchStart={() => handleControl("backward", true)}
                  onTouchEnd={() => handleControl("backward", false)}
                  className="controler__button"
                >
                  <FaCaretDown />
                </button>
                <button
                  onMouseDown={() => handleControl("rotateRight", true)}
                  onMouseUp={() => handleControl("rotateRight", false)}
                  onTouchStart={() => handleControl("rotateRight", true)}
                  onTouchEnd={() => handleControl("rotateRight", false)}
                  className="controler__button"
                >
                  <FaCaretRight />
                </button>
              </div>
            </div>
          )}
          {/* Nút bấm di chuyển */}
          {/* Pop up */}
          <ModelPopup
            open={popupOpen}
            onClose={handleClosePopup}
            imageUrl={selectedImageUrl}
            info={selectedInfo}
            model={selectedModel}
            video={selectedVideo}
            onAudioEnded={handleAudioEnded}
            tourActive={tourActive}
          />
          <PopUpHowToMove
            open={showHowToMove}
            handleClose={handleCloseHowToMove}
          />
          <PopUpAboutTheExhibition
            open={popUpAboutTheExhibition}
            handleClose={handleClosePopUpAboutTheExhibition}
          />
          <PopUpUpdate open={popUpUpdate} onClose={handleClosePopUpUpdate} />
          <PopUpListModel
            open={popUpListModel}
            onClose={handleClosePopUpListModel}
            items={items}
            onItemClick={handleListItemClick}
          />{" "}
          {/* List Popup */}
          {/* Pop up */}
          {/* Đếm thời gian tour */}
          {tourActive && (
            <div className={`tour-countdown ${showCountdown ? "show" : ""}`}>
              {!paused ? (
                <div className="pause-tour" onClick={pauseTour}>
                  Pause Tour
                </div>
              ) : (
                <div className="pause-tour" onClick={continueTour}>
                  Continue Tour
                </div>
              )}
              <div className="end-tour" onClick={endTour}>
                End Tour
              </div>
            </div>
          )}
          {/* Đếm thời gian tour */}
        </div>
        {/* Input file hidden */}
        {/* <input
          ref={inputRef}
          type="file"
          accept=".glb"
          style={{ display: "none" }}
          onChange={handleFileChange}
        /> */}
        <input
          ref={inputRef}
          type="file"
          accept=".glb"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </CameraProvider>
      {/* Respondsive */}
      <ResizeHandler updateItemsForScreenSize={updateItemsForScreenSize} />
      {/* Respondsive */}
    </>
  );
}

export default Custom;
