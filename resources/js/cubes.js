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

    let geometries = [];
    {
        const s = 0.5;

        for (let x = -100; x < 100; x++) {
            for (let y = -10; y < 10; y++) {
                for (let z = -100; z < 100; z++) {
                    const geometry = new THREE.BoxGeometry(s, s, s);
                    geometry.translate(x, y, z);

                    const rgb = [
                        Math.random() * 255,
                        Math.random() * 255,
                        Math.random() * 255
                    ];
                    console.log(rgb)

                    // make an array to store colors for each vertex
                    const numVerts = geometry.getAttribute('position').count;
                    const itemSize = 3;  // r, g, b
                    const colors = new Uint8Array(itemSize * numVerts);

                    // copy the color into the colors array for each vertex
                    colors.forEach((v, ndx) => {
                        colors[ndx] = rgb[ndx % 3];
                    });
                    console.log(colors)
                    const normalized = true;
                    const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized);
                    geometry.setAttribute('color', colorAttrib);

                    geometries.push(geometry);
                }
            }
        }
    }
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
        geometries, false);
    const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
    });
    const mesh = new THREE.Mesh(mergedGeometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}


function animate(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}