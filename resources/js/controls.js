import { PointerLockControls } from './PointerLockControls'

const menu = document.querySelector('#menu');
const play = document.querySelector('#play');
const nav = document.querySelector('nav');
const scrollHeight = nav.scrollHeight;

let controls;

export function getControls(camera, domElement) {
    controls = new PointerLockControls(camera, domElement);

    play.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        menu.style.display = 'none';
        nav.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        menu.style.display = '';
        nav.style.display = '';
        document.body.scrollTop = scrollHeight;
        document.documentElement.scrollTop = scrollHeight;
    });

    return controls;
}