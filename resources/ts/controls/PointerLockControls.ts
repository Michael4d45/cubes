import {
	EventDispatcher,
	PerspectiveCamera,
	Vector3
} from 'three';
import { CameraControls } from './CameraControls';

const _vector = new Vector3();

const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

class PointerLockControls extends EventDispatcher {
	domElement: HTMLElement;
	isLocked = false;
	connect: () => void;
	disconnect: () => void;
	move: (v: Vector3, s: number) => void;
	moveForward: (distance: number) => void;
	moveRight: (distance: number) => void;
	lock: () => void;
	unlock: () => void;

	constructor(camera: PerspectiveCamera, domElement: HTMLElement) {

		super();

		const cameraControls = new CameraControls(camera);

		this.domElement = domElement;
		this.isLocked = false;

		const scope = this;

		function onMouseMove(event: MouseEvent) {

			var movementX = event.movementX || 0;
			var movementY = event.movementY || 0;

			if (scope.isLocked === false) return;

			cameraControls.move(movementX, movementY);
		}

		function onPointerlockChange() {
			if (scope.domElement.ownerDocument.pointerLockElement === scope.domElement) {

				scope.dispatchEvent(_lockEvent);

				scope.isLocked = true;

			} else {

				scope.dispatchEvent(_unlockEvent);

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

		this.move = function (v: Vector3, s: number) {
			this.moveRight(- v.x * s)
			this.moveForward(- v.z * s)

			// move upwards
			camera.position.y -= v.y * s;
		};

		this.moveForward = function (distance) {

			// move forward parallel to the xz-plane
			// assumes camera.up is y-up

			_vector.setFromMatrixColumn(camera.matrix, 0);

			_vector.crossVectors(camera.up, _vector);

			camera.position.addScaledVector(_vector, distance);

		};

		this.moveRight = function (distance) {

			_vector.setFromMatrixColumn(camera.matrix, 0);

			camera.position.addScaledVector(_vector, distance);

		};

		this.lock = function () {

			this.domElement.requestPointerLock();

		};

		this.unlock = function () {

			scope.domElement.ownerDocument.exitPointerLock();

		};

		this.connect();

	}

}

export { PointerLockControls };