import { Vector3 } from 'three';
import { PointerLockControls } from './PointerLockControls'

const menu = document.querySelector('#menu');
const play = document.querySelector('#play');
const nav = document.querySelector('nav');
const scrollHeight = nav.scrollHeight;

let controls;

const velocity = new Vector3();
const direction = new Vector3();

let moveForward, moveBackward, moveLeft, moveRight, moveUp, moveDown;

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

function onKeyDown(event) {
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

function onKeyUp(event) {
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

function getControls(camera, domElement) {
    controls = new PointerLockControls(camera, domElement);

    play.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        menu.style.display = 'none';
        nav.style.display = 'none';
        init()
    });
    controls.addEventListener('unlock', function () {
        menu.style.display = '';
        nav.style.display = '';
        document.body.scrollTop = scrollHeight;
        document.documentElement.scrollTop = scrollHeight;
    });

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return controls;
}

const deceleration = 5;
const acceleration = 10;
function moveCamera(delta) {
    if (controls.isLocked === true) {
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
}

export { getControls, moveCamera }