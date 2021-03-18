const THREE = require('three');
import { PointerLockControls } from './PointerLockControls'

const canvas = document.querySelector('#c');
const menu = document.querySelector('#menu');
const play = document.querySelector('#play');

let camera, scene, renderer, controls;
const animate = false;

init();
render();

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
        var loader = new THREE.ObjectLoader();

        const loadCubes = new Worker('./js/loadCubes.js');
        let count = 0;
        loadCubes.onmessage = function (e) {
            if (!e.data)
                return;
            count += e.data.geometries[0].data.index.array.length
            console.log(count);

            const mesh = loader.parse(e.data);
            scene.add(mesh);

            if (!animate)
                render()
        }

        const distance = 4;
        const checkDistance = distance * distance;
        for (let y = distance; y > -distance; y--) {
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

    window.addEventListener('resize', onWindowResize);

    if (!animate)
        controls.addEventListener('change', render);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight, false);
}


function render() {
    if (animate)
        requestAnimationFrame(render)
    renderer.render(scene, camera);
}