import {
    PerspectiveCamera,
} from 'three';
import { setControls as keyboardControls, moveCamera as keyboardCamera } from './keyboardControls';
import { setControls as touchControls, moveCamera as touchCamera } from './touchControls';

const is_touch_enabled = ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);

const menu: HTMLElement | null = document.querySelector('#menu');
const playTouch: HTMLButtonElement | null = document.querySelector('#play_touch');
const playKeyboard: HTMLButtonElement | null = document.querySelector('#play_keyboard');
const nav: HTMLElement | null = document.querySelector('nav');
const scrollHeight = nav ? nav.scrollHeight : 0;

function closeMenu() {
    if (!menu || !nav) return;

    menu.style.display = 'none';
    nav.style.display = 'none';
}

function openMenu() {
    if (!menu || !nav) return;

    menu.style.display = '';
    nav.style.display = '';
    document.body.scrollTop = scrollHeight;
    document.documentElement.scrollTop = scrollHeight;
}

let useTouch = false;

if (!is_touch_enabled && playTouch) {
    playTouch.remove();
    if (playKeyboard) {
        playKeyboard.textContent = "Play!"
    }
} else if (playTouch) {
    playTouch.addEventListener('click', function () {
        useTouch = true;
    });
}

playKeyboard?.addEventListener('click', function () {
    useTouch = false;
});

function setControls(camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
    if (!playTouch || !playKeyboard) return;

    if (is_touch_enabled)
        touchControls(camera, canvas, playTouch, closeMenu, openMenu);

    keyboardControls(camera, canvas, playKeyboard, closeMenu, openMenu);
}

function moveCamera(delta: number) {
    if (useTouch) {
        touchCamera(delta);
    }
    else {
        keyboardCamera(delta);
    }

}


export { setControls, moveCamera }