import { Euler } from 'three';

var CameraControls = function (camera) {

	// Set to constrain the pitch of the camera
	// Range is 0 to Math.PI radians
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	//
	// internals
	//

	var scope = this;

	var euler = new Euler(0, 0, 0, 'YXZ');

	var PI_2 = Math.PI / 2;

	this.lastX = 0;
	this.lastY = 0;

	this.move = function (movementX, movementY) {
        if(!(movementX && movementY))
            return;
		euler.setFromQuaternion(camera.quaternion);

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max(PI_2 - scope.maxPolarAngle, Math.min(PI_2 - scope.minPolarAngle, euler.x));

		camera.quaternion.setFromEuler(euler);

		scope.lastX = movementX;
		scope.lastY = movementY;
		if(Math.abs(scope.lastX) < 100 && Math.abs(scope.lastY) < 100) {
			scope.lastX = 0;
			scope.lastY = 0;
		}
	}
};

export { CameraControls };