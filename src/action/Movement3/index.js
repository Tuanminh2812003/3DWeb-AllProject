/* eslint-disable default-case */
import React, { useRef, useEffect, useState, useContext } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CameraContext from "../../helpers/CameraContext";

const restrictedAreaCenter = new THREE.Vector3(0, 0, 0);
const restrictedAreaRadius = 25;

const restrictedAreas = [
	{ x: -3.93243, z: -3.30957, radius: 2.5 },
	{ x: 3.7, z: 6.29943, radius: 1.8 },
];

const Movement3 = ({ cameraPosition, cameraRotation, freeExploration }) => {
	const { camera, gl, scene } = useThree();
	const { setYaw } = useContext(CameraContext);

	const moveSpeed = 2.5; // Điều chỉnh tốc độ di chuyển
	const rotateSpeed = 0.0025; // Giảm tốc độ xoay để mượt hơn
	const velocity = useRef(new THREE.Vector3());
	const yaw = useRef(cameraRotation.y);
	const targetYaw = useRef(cameraRotation.y);
	const previousPosition = useRef(new THREE.Vector3());

	const [isMouseDown, setIsMouseDown] = useState(false);
	const initialMousePosition = useRef({ x: 0, y: 0 });

	const moveForward = useRef(false);
	const moveBackward = useRef(false);
	const moveLeft = useRef(false);
	const moveRight = useRef(false);

	const targetPosition = useRef(new THREE.Vector3());
	const moving = useRef(false);

	useEffect(() => {
		camera.position.copy(cameraPosition);
		camera.rotation.copy(cameraRotation);
		yaw.current = camera.rotation.y;
		targetYaw.current = camera.rotation.y;
		previousPosition.current.copy(camera.position);
	}, [camera, cameraPosition, cameraRotation]);

	const isInsideRestrictedCircle = (position) => {
		return (
			position.distanceTo(restrictedAreaCenter) <= restrictedAreaRadius
		);
	};

	const isInRestrictedArea = (position) => {
		return restrictedAreas.some((area) => {
			return (
				position.distanceTo(new THREE.Vector3(area.x, 0, area.z)) <
				area.radius
			);
		});
	};

	const handleClickMove = (event) => {
		if (!freeExploration) return;

		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length > 0) {
			const point = intersects[0].point;
			const newPosition = new THREE.Vector3(
				point.x,
				camera.position.y,
				point.z
			);

			if (
				!isInRestrictedArea(newPosition) &&
				isInsideRestrictedCircle(newPosition)
			) {
				targetPosition.current.copy(newPosition);
				moving.current = true;

				// Quay camera hướng về điểm đến một cách mượt mà
				const direction = new THREE.Vector3()
					.subVectors(newPosition, camera.position)
					.normalize();
				targetYaw.current = Math.atan2(direction.x, direction.z);
			}
		}
	};

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (!freeExploration) return;
			switch (event.code) {
				case "KeyW":
					moveForward.current = true;
					break;
				case "KeyS":
					moveBackward.current = true;
					break;
				case "KeyA":
					moveLeft.current = true;
					break;
				case "KeyD":
					moveRight.current = true;
					break;
			}
		};

		const handleKeyUp = (event) => {
			switch (event.code) {
				case "KeyW":
					moveForward.current = false;
					break;
				case "KeyS":
					moveBackward.current = false;
					break;
				case "KeyA":
					moveLeft.current = false;
					break;
				case "KeyD":
					moveRight.current = false;
					break;
			}
		};

		const handleMouseDown = (event) => {
			if (!freeExploration) return;
			setIsMouseDown(true);
			initialMousePosition.current = {
				x: event.clientX,
				y: event.clientY,
			};
		};

		const handleMouseUp = () => {
			setIsMouseDown(false);
		};

        const handleMouseMove = (event) => {
            if (!freeExploration || !isMouseDown) return;
            targetYaw.current -= event.movementX * 0.003;

            const direction = new THREE.Vector3();
            direction.setFromMatrixColumn(camera.matrix, 0);
            direction.crossVectors(camera.up, direction);
            camera.position.addScaledVector(direction, -event.movementY * 0.01);

            initialMousePosition.current = { x: event.clientX, y: event.clientY };
        };
        const handleTouchEnd = () => {
            setIsMouseDown(false);
        };

        const handleTouchMove = (event) => {
            if (!freeExploration || !isMouseDown || event.touches.length !== 1) return;
            const deltaX = event.touches[0].clientX - initialMousePosition.current.x;
            const deltaY = event.touches[0].clientY - initialMousePosition.current.y;

            targetYaw.current -= deltaX * 0.005;

            const direction = new THREE.Vector3();
            direction.setFromMatrixColumn(camera.matrix, 0);
            direction.crossVectors(camera.up, direction);
            camera.position.addScaledVector(direction, -deltaY * 0.05);

            initialMousePosition.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        };
		gl.domElement.addEventListener("pointerdown", handleMouseDown);
		gl.domElement.addEventListener("pointerup", handleMouseUp);
		gl.domElement.addEventListener("pointermove", handleMouseMove);
		gl.domElement.addEventListener("click", handleClickMove);
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			gl.domElement.removeEventListener("pointerdown", handleMouseDown);
			gl.domElement.removeEventListener("pointerup", handleMouseUp);
			gl.domElement.removeEventListener("pointermove", handleMouseMove);
			gl.domElement.removeEventListener("click", handleClickMove);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [camera, gl.domElement, freeExploration]);

	useFrame((state, delta) => {
		const direction = new THREE.Vector3();
		const right = new THREE.Vector3();
		const moveVector = new THREE.Vector3();

		if (moveForward.current) {
			direction.setFromMatrixColumn(camera.matrix, 0);
			direction.crossVectors(camera.up, direction);
			moveVector.addScaledVector(direction, moveSpeed * delta);
		}
		if (moveBackward.current) {
			direction.setFromMatrixColumn(camera.matrix, 0);
			direction.crossVectors(camera.up, direction);
			moveVector.addScaledVector(direction, -moveSpeed * delta);
		}
		if (moveLeft.current) {
			right.setFromMatrixColumn(camera.matrix, 0);
			moveVector.addScaledVector(right, -moveSpeed * delta);
		}
		if (moveRight.current) {
			right.setFromMatrixColumn(camera.matrix, 0);
			moveVector.addScaledVector(right, moveSpeed * delta);
		}

		velocity.current.lerp(moveVector, 0.1);
		camera.position.add(velocity.current);

		if (moving.current) {
			camera.position.lerp(targetPosition.current, 0.02);
			if (camera.position.distanceTo(targetPosition.current) < 0.1) {
				moving.current = false;
			}
		}

		if (
			isInRestrictedArea(camera.position) ||
			!isInsideRestrictedCircle(camera.position)
		) {
			camera.position.copy(previousPosition.current);
			velocity.current.set(0, 0, 0);
		} else {
			previousPosition.current.copy(camera.position);
		}

		yaw.current = THREE.MathUtils.lerp(
			yaw.current,
			targetYaw.current,
			0.05
		);
		camera.rotation.set(0, yaw.current, 0);
		setYaw(camera.rotation.y);
	});

	return null;
};

export default Movement3;
