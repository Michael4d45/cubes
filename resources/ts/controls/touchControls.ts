const Hammer = require('hammerjs');
import {
    PerspectiveCamera,
    Vector3,
} from 'three';
import { CameraControls } from './CameraControls';

let hammer: typeof Hammer,
    cameraControls: CameraControls,
    camera: PerspectiveCamera;
let playing = false;

let speed = 0;
var direction = new Vector3();

function onLeft({ x, y }: { x: number, y: number }, width: number) {
    return x < (width / 2);
}

const maxSpeed = 2;
function updateSpeed(dX: number, dY: number) {
    if (Math.abs(speed) >= maxSpeed) return;

    speed += -1 * Math.sign(dY) * Math.sqrt(Math.abs(dY)) * 0.01;
    console.log(speed);
}

const acceleration = 0.01;
function decelerate() {
    if (speed == 0) return;
    if (Math.abs(speed) <= acceleration) {
        speed = 0;
        return;
    }
    speed -= Math.sign(speed) * acceleration;
}

function updateDirection(dX: number, dY: number) {
    cameraControls.move(dX, dY);
}

function setControls(cam: PerspectiveCamera, canvas: HTMLCanvasElement, play: HTMLElement, closeMenu: () => void, openMenu: () => void) {
    camera = cam;
    cameraControls = new CameraControls(cam);

    //alert("using touch controls");
    hammer = new Hammer(canvas);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

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

    hammer.on("pan", function (ev: any) {
        if (!playing) return;

        if (onLeft(ev.center, canvas.width))
            updateSpeed(ev.deltaX, ev.deltaY);
        else
            updateDirection(ev.deltaX, ev.deltaY);
    });
}

function moveCamera(delta: number) {
    decelerate();
    if (!playing) return;

    camera.getWorldDirection(direction);
    camera.position.add(direction.multiplyScalar(speed));
}

export { setControls, moveCamera }