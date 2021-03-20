const THREE = require('three');
import { PointerLockControls } from './PointerLockControls'
import { VRButton } from './VRButton';

const canvas = document.querySelector('#c');
const menu = document.querySelector('#menu');
const play = document.querySelector('#play');
const vr = document.querySelector('#VRButton');

let camera, scene, renderer, controls;
let hasVR = false;

init();

async function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 1.6, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

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

    scene.add(controls.getObject());

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    hasVR = await VRButton.createButton(renderer, vr);
    if (hasVR)
        renderer.xr.enabled = true;

    loadCubes();

    window.addEventListener('resize', onWindowResize);

    if (!hasVR)
        controls.addEventListener('change', render);
    else
        renderer.setAnimationLoop(render);
}

function loadCubes() {
    const loader = new THREE.ObjectLoader();

    const loadCubes = new Worker('./js/loadCubes.js');
    let count = 0;
    let t1, t2;
    t1 = false;
    let ave = 0;
    loadCubes.onmessage = function (e) {
        if (!e.data)
            return;

        if (!t1) {
            t1 = performance.now();
        }
        else {
            t2 = performance.now();
            ave = Math.round(count / ((t2 - t1) / 1000));
        }
        count += e.data[1];
        console.log(count, ave);

        const mesh = loader.parse(e.data[0]);
        scene.add(mesh);

        if (!hasVR)
            render()
    }

    const distance = 4;
    const checkDistance = distance * distance;
    for (let y = distance; y >= -distance; y--) {
        let x = 0;
        let z = 0;
        let incX = true;
        let inc = 1;
        let limit = 1;
        while (Math.abs(x) <= distance || Math.abs(z) <= distance) {
            if ((x * x + y * y + z * z) <= checkDistance)
                loadCubes.postMessage([x, y, z])

            if (incX) {
                x += inc;
                if (Math.abs(x) >= limit)
                    incX = false;
            }
            else {
                z += inc;
                if (Math.abs(z) >= limit) {
                    incX = true;
                    inc *= -1
                    if (inc == 1)
                        limit++
                }
            }
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight, false);
}


function render() {
    renderer.render(scene, camera);
}