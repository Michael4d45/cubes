import {
	EventDispatcher,
	Vector3
} from 'three';
import { CameraControls } from './CameraControls';

var PointerLockControls = function (camera, domElement) {

	const cameraControls = new CameraControls(camera);

	if (domElement === undefined) {

		console.warn('THREE.PointerLockControls: The second parameter "domElement" is now mandatory.');
		domElement = document.body;

	}

	this.domElement = domElement;
	this.isLocked = false;

	//
	// internals
	//

	var scope = this;

	var lockEvent = { type: 'lock' };
	var unlockEvent = { type: 'unlock' };

	var vec = new Vector3();

	function onMouseMove(event) {

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		if (scope.isLocked === false) return;

		cameraControls.move(movementX, movementY);
	}

	function onPointerlockChange(event) {
		if (scope.domElement.ownerDocument.pointerLockElement === scope.domElement) {

			scope.dispatchEvent(lockEvent);

			scope.isLocked = true;

		} else {

			scope.dispatchEvent(unlockEvent);

			cameraControls.move(-cameraControls.lastX, -cameraControls.lastY);
			cameraControls.lastX = 0;
			cameraControls.lastY = 0;

			scope.isLocked = false;

		}

	}

	this.connect = function () {

		scope.domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange, true);
		scope.domElement.addEventListener('mousemove', onMouseMove, true);

	};

	this.disconnect = function () {

		scope.domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange);
		scope.domElement.removeEventListener('mousemove', onMouseMove);

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.move = function (v, s) {
		this.moveRight(- v.x * s)
		this.moveForward(- v.z * s)

		// move upwards
		camera.position.y -= v.y * s;
	};

	this.moveForward = function (distance) {

		// move forward parallel to the xz-plane
		// assumes camera.up is y-up

		vec.setFromMatrixColumn(camera.matrix, 0);

		vec.crossVectors(camera.up, vec);

		camera.position.addScaledVector(vec, distance);

	};

	this.moveRight = function (distance) {

		vec.setFromMatrixColumn(camera.matrix, 0);

		camera.position.addScaledVector(vec, distance);

	};

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		scope.domElement.ownerDocument.exitPointerLock();

	};

	this.connect();

};

PointerLockControls.prototype = Object.create(EventDispatcher.prototype);
PointerLockControls.prototype.constructor = PointerLockControls;

export { PointerLockControls };