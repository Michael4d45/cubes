const THREE = require('three');
import { setControls, moveCamera } from './controls';
import { VRButton } from './controls/VRButton';
import Cubes from './cubes';

const canvas: HTMLCanvasElement | null = document.querySelector('#c');
const vr: HTMLButtonElement | null = document.querySelector('#VRButton');

let camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    cubes: Cubes;

let prevTime = performance.now();

init();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);
    scene.add(camera);

    scene.background = new THREE.Color(0xffffff);
    //scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const light = new THREE.HemisphereLight(0xffffff, 0x888888);
    light.position.set(- 1, 1.5, 1);
    scene.add(light);

    if (canvas) {
        setControls(camera, canvas);
    }

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
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