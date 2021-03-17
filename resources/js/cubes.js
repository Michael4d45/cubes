const THREE = require('three');
import { PointerLockControls } from './PointerLockControls'
import { BufferGeometryUtils } from './BufferGeometryUtils'

const canvas = document.querySelector('#c');
const menu = document.querySelector('#menu');
const play = document.querySelector('#play');

let camera, scene, renderer, controls;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    {
        const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        light.position.set(0.5, 1, 0.75);
        scene.add(light);
    }

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

    {
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true,
        });

        const myWorker = new Worker('./js/loadCubes.js');
        myWorker.onmessage = function (e) {
            let geometries = [];
            for (const elem of e.data) {
                let geometry = new THREE.BoxGeometry;
                let index = new THREE.Uint16BufferAttribute;
                Object.assign(geometry, elem);
                Object.assign(index, elem.index);
                geometry.index = index;
                geometries.push(geometry);
            }
            const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
                geometries, false);
            const mesh = new THREE.Mesh(mergedGeometry, material);
            scene.add(mesh)
        }

        const numChunks = 4;
        for (let y = -1; y > ((-numChunks / 2) - 1); y--) {
            for (let x = -numChunks / 2; x < numChunks / 2; x++) {
                for (let z = -numChunks / 2; z < numChunks / 2; z++) {
                    console.log(x, y, z)
                    myWorker.postMessage([x, y, z])
                }
            }
        }
    }

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight, false);
}


function animate(time) {
    time *= 0.001;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}