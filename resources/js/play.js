const THREE = require('three');
import { getControls, moveCamera } from './controls';
import { VRButton } from './VRButton';
import Cubes from './cubes';

const canvas = document.querySelector('#c');
const vr = document.querySelector('#VRButton');

let camera, scene, renderer, controls, cubes;

const cubeMatrix = new THREE.Matrix4();
let prevTime = performance.now();

init();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);

    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xffffff);
    //scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const light = new THREE.HemisphereLight(0xffffff, 0x888888);
    light.position.set(- 1, 1.5, 1);
    scene.add(light);

    controls = getControls(camera, canvas);
    scene.add(controls.getObject());

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    VRButton.createButton(renderer, vr);
    renderer.xr.enabled = true;

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
    // for (let i = 0; i < 100; i++) {
    //     if (cubes.children.length > 0) {
    //         const mesh = cubes.children[Math.floor(Math.random() * cubes.children.length)];
    //         const cubeID = Math.floor(mesh.count * Math.random());
    //         mesh.getMatrixAt(cubeID, cubeMatrix);
    //         moveRandomly(cubeMatrix);
    //         mesh.setMatrixAt(cubeID, cubeMatrix);
    //         mesh.instanceMatrix.needsUpdate = true;
    //     }
    // }
	const time = performance.now();
    const delta = ( time - prevTime ) / 1000;
    prevTime = time;

    moveCamera(delta)

    cubes.update(camera.position)

    renderer.render(scene, camera);
}

function moveRandomly(matrix) {
    let inc = 1;
    if (Math.random() > 0.5) inc *= -1;

    switch (Math.floor(Math.random() * 3)) {
        case 0:
            matrix.elements[12] += inc;
            break;
        case 1:
            matrix.elements[13] += inc;
            break;
        case 2:
            matrix.elements[14] += inc;
            break;
    }
}