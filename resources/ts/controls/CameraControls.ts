import { 
	Euler, 
	PerspectiveCamera,
 } from 'three';

var PI_2 = Math.PI / 2;

class CameraControls {
	// Set to constrain the pitch of the camera
	// Range is 0 to Math.PI radians
	minPolarAngle: number = 0; // radians
	maxPolarAngle: number = Math.PI; // radians
	lastX: number = 0;
	lastY: number = 0;
	move: (movementX: number, movementY: number) => void;

	constructor(camera: PerspectiveCamera) {

		var scope = this;

		var euler = new Euler(0, 0, 0, 'YXZ');

		this.move = function (movementX: number, movementY: number) {
			if ((typeof movementX !== 'number') || (typeof movementY !== 'number'))
				return;

			euler.setFromQuaternion(camera.quaternion);

			euler.y -= movementX * 0.002;
			euler.x -= movementY * 0.002;

			euler.x = Math.max(PI_2 - scope.maxPolarAngle, Math.min(PI_2 - scope.minPolarAngle, euler.x));

			camera.quaternion.setFromEuler(euler);

			scope.lastX = movementX;
			scope.lastY = movementY;
			if (Math.abs(scope.lastX) < 100 && Math.abs(scope.lastY) < 100) {
				scope.lastX = 0;
				scope.lastY = 0;
			}
		}
	}
}

export { CameraControls };