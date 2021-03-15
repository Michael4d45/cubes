const THREE = require('three');
import {PointerLockControls} from './pointerLockControls'

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });

const fov = 45;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
camera.position.y = 4;

const scene = new THREE.Scene();

const controls = new PointerLockControls( camera, canvas );
canvas.addEventListener( 'click', function () {
    controls.lock();
} );
scene.add( controls.getObject() )

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

{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, 5, 1);
    scene.add(light);
}

{
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    for (let x = -100; x < 100; x++) {
        for (let z = -100; z < 100; z++) {
            const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff, flatShading: true });

            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x, 0, z);

            scene.add(cube);
        }
    }
}

function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);