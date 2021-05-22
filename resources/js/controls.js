import { setControls as keyboardControls, moveCamera as keyboardCamera } from './keyboardControls';
import { setControls as touchControls, moveCamera as touchCamera } from './touchControls';

const is_touch_enabled = ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);

const menu = document.querySelector('#menu');
const play = document.querySelector('#play');
const nav = document.querySelector('nav');
const scrollHeight = nav.scrollHeight;

function closeMenu() {
    console.log("closing 2")
    menu.style.display = 'none';
    nav.style.display = 'none';
}

function openMenu() {
    menu.style.display = '';
    nav.style.display = '';
    document.body.scrollTop = scrollHeight;
    document.documentElement.scrollTop = scrollHeight;
}

function setControls(camera, canvas) {

    if (is_touch_enabled) {
        touchControls(camera, canvas, play, closeMenu, openMenu);
    } else {
        keyboardControls(camera, canvas, play, closeMenu, openMenu);
    }
}

let moveCamera;

if (is_touch_enabled)
    moveCamera = touchCamera;
else
    moveCamera = keyboardCamera;

export { setControls, moveCamera }