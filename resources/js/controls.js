import { PointerLockControls } from './PointerLockControls'

const menu = document.querySelector('#menu');
const play = document.querySelector('#play');

let controls;

export function getControls(camera) {
    controls = new PointerLockControls(camera, document.body);

    play.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        menu.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        menu.style.display = '';
    });
    
    return controls;
}