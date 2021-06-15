import { 
    PerspectiveCamera, 
    Vector3,
 } from 'three';
import { PointerLockControls } from './PointerLockControls'

let controls: PointerLockControls;

const velocity = new Vector3();
const direction = new Vector3();

let moveForward: boolean,
    moveBackward: boolean,
    moveLeft: boolean,
    moveRight: boolean,
    moveUp: boolean,
    moveDown: boolean;

function init() {
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    moveUp = false;
    moveDown = false;
    velocity.set(0, 0, 0);
}

init();

function onKeyDown(event: KeyboardEvent) {
    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            moveUp = true;
            break;

        case 'ShiftLeft':
            moveDown = true;
            break;
    }
};

function onKeyUp(event: KeyboardEvent) {
    console.log(event.code);
    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

        case 'Space':
            moveUp = false;
            break;

        case 'ShiftLeft':
            moveDown = false;
            break;
    }
};

function setControls(camera: PerspectiveCamera, canvas: HTMLCanvasElement, play: HTMLButtonElement, closeMenu: () => void, openMenu: () => void) {
    controls = new PointerLockControls(camera, canvas);

    play.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        closeMenu();
        init();
    });
    controls.addEventListener('unlock', function () {
        openMenu();
    });

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

const deceleration = 5;
const acceleration = 10;
function moveCamera(delta: number) {
    if (controls.isLocked !== true) return;

    velocity.x -= velocity.x * deceleration * delta;
    velocity.y -= velocity.y * deceleration * delta;
    velocity.z -= velocity.z * deceleration * delta;

    direction.x = Number(moveRight) - Number(moveLeft);
    direction.y = Number(moveUp) - Number(moveDown);
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveLeft || moveRight) velocity.x -= direction.x * acceleration * delta;
    if (moveUp || moveDown) velocity.y -= direction.y * acceleration * delta;
    if (moveForward || moveBackward) velocity.z -= direction.z * acceleration * delta;

    controls.move(velocity, delta);
}

export { setControls, moveCamera }