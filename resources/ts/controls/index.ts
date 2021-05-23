import { 
    PerspectiveCamera,
 } from 'three';
import { setControls as keyboardControls, moveCamera as keyboardCamera } from './keyboardControls';
import { setControls as touchControls, moveCamera as touchCamera } from './touchControls';

const is_touch_enabled = ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);

const menu: HTMLElement | null = document.querySelector('#menu');
const play: HTMLElement | null = document.querySelector('#play');
const nav: HTMLElement | null = document.querySelector('nav');
const scrollHeight = nav ? nav.scrollHeight : 0;

function closeMenu() {
    if(!menu || !nav) return;
    
    menu.style.display = 'none';
    nav.style.display = 'none';
}

function openMenu() {
    if(!menu || !nav) return;

    menu.style.display = '';
    nav.style.display = '';
    document.body.scrollTop = scrollHeight;
    document.documentElement.scrollTop = scrollHeight;
}

function setControls(camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
    if(!play) return;

    if (is_touch_enabled) {
        touchControls(camera, canvas, play, closeMenu, openMenu);
    } else {
        keyboardControls(camera, canvas, play, closeMenu, openMenu);
    }
}

let moveCamera: (delta: number) => void;

if (is_touch_enabled)
    moveCamera = touchCamera;
else
    moveCamera = keyboardCamera;

export { setControls, moveCamera }