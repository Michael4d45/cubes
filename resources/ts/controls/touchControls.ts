import {
    PerspectiveCamera,
    Vector3,
} from 'three';
import { CameraControls } from './CameraControls';
import { Touches, TouchPoint } from './Touches';

let touches: Touches,
    cameraControls: CameraControls,
    camera: PerspectiveCamera;
let playing = false;

let speed = 0;
var direction = new Vector3();

function onLeft(x: number, width: number) {
    return x < (width / 2);
}

const maxSpeed = 10;
let speeding = false;
let speed_id: number | undefined;

function updateSpeed(dX: number, dY: number) {
    speed = -1 * (dY / window.innerHeight) * maxSpeed;

    if (Math.abs(speed) >= maxSpeed) { 
        speed = Math.sign(speed) * maxSpeed;
    };
}


const acceleration = 0.1;

function decelerate() {
    if (speed == 0) return;
    if (Math.abs(speed) <= acceleration) {
        speed = 0;
        return;
    }
    speed -= Math.sign(speed) * acceleration;
}

const direction_scale = 50;
let direction_id: number | undefined;
let direction_x = 0;
let direction_y = 0;
function updateDirection(dX: number, dY: number) {
    direction_x = (dX / (window.innerWidth / 2)) * direction_scale;
    direction_y = (dY / window.innerHeight) * direction_scale;
}

function setControls(cam: PerspectiveCamera, canvas: HTMLCanvasElement, play: HTMLButtonElement, closeMenu: () => void, openMenu: () => void) {
    camera = cam;
    cameraControls = new CameraControls(cam);

    touches = new Touches(canvas);

    play.addEventListener('click', function () {
        closeMenu();
        playing = true;
        document.body.requestFullscreen();
    });

    document.body.onfullscreenchange = function () {
        if (!document.fullscreenElement) {
            openMenu();
            playing = false;
        }
    }

    touches.on("pan", function (touch: TouchPoint) {
        if (!playing) return;

        // continue pan
        if (touch.touch.identifier == speed_id) {
            updateSpeed(touch.deltaX, touch.deltaY);
        }

        else if (touch.touch.identifier == direction_id) {
            updateDirection(touch.deltaX, touch.deltaY);
        }

        // start pan
        else if (onLeft(touch.curPos.x, canvas.width)) {
            if (speed_id == undefined) {
                speed_id = touch.touch.identifier;
                updateSpeed(touch.deltaX, touch.deltaY);
                speeding = true;
            }
        }
        else {
            if (direction_id == undefined) {
                direction_id = touch.touch.identifier;
                updateDirection(touch.deltaX, touch.deltaY);
            }
        }
    });

    touches.on("endpan", function (touch: TouchPoint) {
        // end pan
        if (touch.touch.identifier == speed_id) {
            speeding = false;
            speed_id = undefined;
        }
        if (touch.touch.identifier == direction_id) {
            direction_id = undefined;
            updateDirection(0, 0);
        }
    });
}

function moveCamera(delta: number) {
    if (!speeding) decelerate();
    if (!playing) return;

    cameraControls.move(direction_x, direction_y);
    camera.getWorldDirection(direction);
    camera.position.add(direction.multiplyScalar(speed * delta));
}

export { setControls, moveCamera }