const Hammer = require('hammerjs');
import { Vector3 } from 'three';
import { CameraControls } from './CameraControls';

let hammer, cameraControls, camera;
let playing = false;
let speed = 0;
var direction = new Vector3();

function onLeft({ x, y }, width) {
    return x < (width / 2);
}

const maxSpeed = 2;
function updateSpeed(dX, dY) {
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

function updateDirection(dX, dY) {
    cameraControls.move(dX, dY);
}

function setControls(cam, canvas, play, closeMenu, openMenu) {
    camera = cam;
    cameraControls = new CameraControls(cam);

    //alert("using touch controls");
    hammer = new Hammer(canvas);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    play.addEventListener('click', function () {
        console.log("closing 1")
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

    hammer.on("pan tap press", function (ev) {
        //console.log(ev);
    });

    hammer.on("pan", function (ev) {
        if (!playing) return;

        if (onLeft(ev.center, canvas.width))
            updateSpeed(ev.deltaX, ev.deltaY);
        else
            updateDirection(ev.deltaX, ev.deltaY);
    });
}

function moveCamera(delta) {
    decelerate();
    if (!playing) return;    

    camera.getWorldDirection( direction );
    camera.position.add( direction.multiplyScalar(speed) );
}

export { setControls, moveCamera }