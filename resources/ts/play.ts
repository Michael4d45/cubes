import {
    Color,
    HemisphereLight,
    PerspectiveCamera,
    Scene,
    WebGLRenderer, 
} from 'three';
import { setControls, moveCamera } from './controls';
import { VRButton } from './controls/VRButton';
import Cubes from './cubes';

const canvas: HTMLCanvasElement | null = document.querySelector('#c');
const vr: HTMLButtonElement | null = document.querySelector('#VRButton');

let camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    cubes: Cubes;

let prevTime = performance.now();

init();

function init() {
    if(!canvas) return;

    scene = new Scene();

    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);
    scene.add(camera);

    scene.background = new Color(0xffffff);
    //scene.fog = new Fog(0xffffff, 0, 750);

    const light = new HemisphereLight(0xffffff, 0x888888);
    light.position.set(- 1, 1.5, 1);
    scene.add(light);

    setControls(camera, canvas);

    renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    if (vr) {
        VRButton.createButton(renderer, vr);
        renderer.xr.enabled = true;
    }

    cubes = new Cubes(scene, camera.position);

    window.addEventListener('resize', onWindowResize);

    renderer.setAnimationLoop(render);


}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight, false);
}

function render() {
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    prevTime = time;

    moveCamera(delta)

    cubes.update(camera.position)

    renderer.render(scene, camera);
}