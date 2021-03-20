const THREE = require('three');
import { getControls } from './controls';
import { loadCubes } from './loadCubes';
import { VRButton } from './VRButton';

const canvas = document.querySelector('#c');
const vr = document.querySelector('#VRButton');

let camera, scene, renderer, controls, cubes;

init();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const light = new THREE.HemisphereLight( 0xffffff, 0xffffff * 0.5 );
    light.position.set( - 1, 1.5, 1 );
    scene.add( light );
    
    controls = getControls(camera);

    scene.add(controls.getObject());

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    VRButton.createButton(renderer, vr);
    renderer.xr.enabled = true;

    cubes = new THREE.Object3D;
    cubes.scale.set(0.25, 0.25, 0.25);
    scene.add(cubes);

    loadCubes(cubes);

    window.addEventListener('resize', onWindowResize);

    renderer.setAnimationLoop(render);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight, false);
}


function render() {
    // if (cubes.children.length > 0) {
    //     let mesh = cubes.children[Math.floor(Math.random() * cubes.children.length)];
    //     console.log(mesh);
    //     mesh.material.visible = !mesh.material.visible;
    //     //mesh.needsUpdate = true;
    // }

    renderer.render(scene, camera);
}