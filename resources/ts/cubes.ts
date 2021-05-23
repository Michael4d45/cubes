import { 
    InstancedMesh, 
    Matrix4, 
    Object3D, 
    ObjectLoader, 
    Scene, 
    Vector3,
} from 'three';
import { chunkSize } from './settings';

const loader = new ObjectLoader();
const cubeSize = 0.25;
const cubeMatrix = new Matrix4();

const hDistance = 4;
const vDistance = 2;
const loadDistance = hDistance * hDistance;
const releaseDistance = loadDistance * 2;

interface Chunk {
    pos: Vector3,
    mesh: InstancedMesh | null
}

class Cubes {
    curChunk = new Vector3;
    newChunk = new Vector3;
    loadCubesWorker: Worker;
    cubesObject: Object3D;
    cubes: Map<string, Chunk>;

    constructor(scene: Scene, pos: Vector3) {

        this.cubesObject = new Object3D;
        this.cubesObject.scale.set(cubeSize, cubeSize, cubeSize);

        this.cubes = new Map;

        scene.add(this.cubesObject);

        this.loadCubesWorker = new Worker('./js/loadCubesWorker.js');

        let count = 0;
        let t1, t2;
        t1 = false;
        let ave = 0;
        const scope = this;
        this.loadCubesWorker.onmessage = function (e) {
            if (!e.data) return;

            const mesh: InstancedMesh = loader.parse(e.data[0]);
            const posData = (new Vector3()).copy(e.data[1]);
            const key = posData.toArray().toString();

            scope.cubes.set(key, { pos: posData, mesh: mesh });

            scope.cubesObject.add(mesh);

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

        cameraPosToCurChunk(pos, this.curChunk)

        this.loadCubes();
    }

    update(pos: Vector3) {
        cameraPosToCurChunk(pos, this.newChunk)
        if (!this.newChunk.equals(this.curChunk)) {
            this.curChunk.copy(this.newChunk);

            this.releaseUpdates(this.curChunk);
            this.loadCubes();
        }

        for (let i = 0; i < 10; i++) {
            if (this.cubesObject.children.length > 0) {
                const mesh = <InstancedMesh>this.cubesObject.children[Math.floor(Math.random() * this.cubesObject.children.length)];
                const cubeID: number = Math.floor(mesh.count * Math.random());
                mesh.getMatrixAt(cubeID, cubeMatrix);
                moveRandomly(cubeMatrix);
                mesh.setMatrixAt(cubeID, cubeMatrix);
                mesh.instanceMatrix.needsUpdate = true;
            }
        }
    }

    loadCubes() {
        for (let y = vDistance; y >= -vDistance; y--) {
            let x = 0;
            let z = 0;
            let incX = true;
            let inc = 1;
            let limit = 1;
            while (Math.abs(x) <= hDistance || Math.abs(z) <= hDistance) {
                const pos = new Vector3(x + this.curChunk.x, y + this.curChunk.y, z + this.curChunk.z);
                const key = pos.toArray().toString();
                if (isClose(x, y, z, loadDistance) && !(this.cubes.has(key))) {
                    this.cubes.set(key, { pos: pos, mesh: null })
                    this.loadCubesWorker.postMessage(pos);
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


    releaseUpdates(myChunkPos: Vector3) {
        this.cubes.forEach(({ pos, mesh }, key) => {
            if (!isClose(pos.x, pos.y, pos.z, releaseDistance, myChunkPos)) {
                this.cubes.delete(key);
                if (mesh) {
                    mesh.dispose();
                    this.cubesObject.remove(mesh);
                }
            }
        });
    }
}

function isClose(x: number, y: number, z: number, d: number, offset?: Vector3) {
    if (offset) {
        x -= offset.x;
        y -= offset.y;
        z -= offset.z;
    }
    return (x * x + y * y + z * z) <= d
}

function cameraPosToCurChunk(pos: Vector3, chunk: Vector3) {
    chunk.set(
        Math.floor((pos.x / cubeSize) / chunkSize),
        Math.floor((pos.y / cubeSize) / chunkSize),
        Math.floor((pos.z / cubeSize) / chunkSize)
    )
}

function moveRandomly(matrix: Matrix4) {
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

export default Cubes;