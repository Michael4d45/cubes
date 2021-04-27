import { Matrix4, Object3D, ObjectLoader, Vector3 } from 'three';
import { chunkSize } from './settings';

const loader = new ObjectLoader();
const cubeSize = 0.25;
const cubeMatrix = new Matrix4();

const hDistance = 4;
const vDistance = 2;
const loadDistance = hDistance * hDistance;
const releaseDistance = loadDistance * 2;

export default function Cubes(scene, pos) {

    const cubesObject = new Object3D;
    cubesObject.scale.set(cubeSize, cubeSize, cubeSize);

    const cubes = [];

    scene.add(cubesObject);

    const loadCubesWorker = new Worker('./js/loadCubesWorker.js');

    let count = 0;
    let t1, t2;
    t1 = false;
    let ave = 0;
    loadCubesWorker.onmessage = function (e) {
        if (!e.data)
            return;

        const mesh = loader.parse(e.data[0]);
        const pos = e.data[1];

        cubes[pos] = [pos, mesh];

        cubesObject.add(mesh);

        // count += mesh.count;
        // if (!t1) {
        //     t1 = performance.now();
        // }
        // else {
        //     t2 = performance.now();
        //     ave = Math.round(count / ((t2 - t1) / 1000));
        // }
        // console.log(count, ave);
    }

    let curChunk = cameraPosToCurChunk(pos)

    loadCubes();

    function loadCubes() {
        for (let y = vDistance; y >= -vDistance; y--) {
            let x = 0;
            let z = 0;
            let incX = true;
            let inc = 1;
            let limit = 1;
            while (Math.abs(x) <= hDistance || Math.abs(z) <= hDistance) {
                const pos = [x + curChunk.x, y + curChunk.y, z + curChunk.z]
                if (isClose(x, y, z, loadDistance) && !(pos in cubes)) {
                    cubes[pos] = [pos, null]
                    loadCubesWorker.postMessage(pos);
                }

                if (incX) {
                    x += inc;
                    if (Math.abs(x) >= limit)
                        incX = false;
                }
                else {
                    z += inc;
                    if (Math.abs(z) >= limit) {
                        incX = true;
                        inc *= -1;
                        if (inc == 1)
                            limit++;
                    }
                }
            }
        }
    }

    this.update = function (pos) {
        const newChunk = cameraPosToCurChunk(pos)
        if (!newChunk.equals(curChunk)) {
            curChunk = newChunk;

            releaseUpdates(curChunk);
            loadCubes();
        }

        for (let i = 0; i < 100; i++) {
            if (cubesObject.children.length > 0) {
                const mesh = cubesObject.children[Math.floor(Math.random() * cubesObject.children.length)];
                const cubeID = Math.floor(mesh.count * Math.random());
                mesh.getMatrixAt(cubeID, cubeMatrix);
                moveRandomly(cubeMatrix);
                mesh.setMatrixAt(cubeID, cubeMatrix);
                mesh.instanceMatrix.needsUpdate = true;
            }
        }
    }

    function releaseUpdates(pos) {
        for (const key in cubes) {
            const [chunkPos, mesh] = cubes[key]
            if (!isClose(...chunkPos, releaseDistance, pos)) {
                delete cubes[key];
                if (mesh) {
                    mesh.dispose();
                    cubesObject.remove(mesh);
                }
            }
        }
    }
}

function isClose(x, y, z, d, offset) {
    if (offset) {
        x -= offset.x;
        y -= offset.y;
        z -= offset.z;
    }
    return (x * x + y * y + z * z) <= d
}

function cameraPosToCurChunk(pos) {
    const x = Math.floor((pos.x / cubeSize) / chunkSize);
    const y = Math.floor((pos.y / cubeSize) / chunkSize);
    const z = Math.floor((pos.z / cubeSize) / chunkSize);
    return new Vector3(x, y, z);
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