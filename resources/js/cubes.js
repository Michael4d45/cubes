import { Object3D, ObjectLoader, Vector3 } from 'three';
import { chunkSize } from './settings';

const loader = new ObjectLoader();
const cubeSize = 0.25;

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

    const hDistance = 4;
    const vDistance = 2;
    const loadDistance = hDistance * hDistance;
    const releaseDistance = loadDistance * 2;

    let curChunk = posToCurChunk(pos)

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
                if (isClose(x, y, z, loadDistance) && !isLoaded(pos))
                    loadCubesWorker.postMessage(pos);

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

    function isClose(x, y, z, d, offset) {
        if (offset) {
            x -= offset.x;
            y -= offset.y;
            z -= offset.z;
        }
        return (x * x + y * y + z * z) <= d
    }

    function posToCurChunk(pos) {
        const x = Math.floor((pos.x / cubeSize) / chunkSize);
        const y = Math.floor((pos.y / cubeSize) / chunkSize);
        const z = Math.floor((pos.z / cubeSize) / chunkSize);
        return new Vector3(x, y, z);
    }

    this.update = function (pos) {
        const newChunk = posToCurChunk(pos)
        if (!newChunk.equals(curChunk)) {
            curChunk = newChunk;

            releaseUpdates(curChunk);
            loadCubes();
        }
    }

    function releaseUpdates(pos) {
        for (const key in cubes) {
            const [chunkPos, mesh] = cubes[key]
            if (!isClose(...chunkPos, releaseDistance, pos)) {
                cubesObject.remove(mesh)
                mesh.dispose()
                delete cubes[key];
            }
        }
    }

    function isLoaded(pos) {
        return pos.toString() in cubes
    }
}