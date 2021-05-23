import {
    BoxGeometry,
    InstancedMesh,
    Matrix4,
    Color,
    MeshPhongMaterial,
} from 'three';
import { chunkSize } from '../settings';

const s = 1;
const density = 0.005;

const box = new BoxGeometry(s, s, s);
const material = new MeshPhongMaterial();

const matrix = new Matrix4();
const color = new Color();

onmessage = function (e) {
    const pos: Position = e.data;

    const cubeData: Cubes = spoofData(pos);
    if (cubeData.count <= 0)
        return;

    const mesh = new InstancedMesh(box, material, cubeData.count);
    for (let i = 0; i < cubeData.count; i++) {
        const cube = cubeData.array[i];
        matrix.setPosition(cube.position.x, cube.position.y, cube.position.z);

        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, color.setHex(cube.attributes.color));
    }

    postMessage([mesh.toJSON(), pos]);
}

function spoofData(pos: Position) {

    const cubes: Cubes = {
        array: [],
        count: 0
    }

    const hexColor = Math.random() * 0xffffff;
    for (let x = 0; x < chunkSize; x++) {
        for (let y = 0; y < chunkSize; y++) {
            for (let z = 0; z < chunkSize; z++) {
                if (Math.random() > density) continue;
                cubes.array.push({
                    position: {
                        x: x + (pos.x * chunkSize),
                        y: y + (pos.y * chunkSize),
                        z: z + (pos.z * chunkSize)
                    },
                    attributes: {
                        color: hexColor
                    }
                });
                cubes.count++;
            }
        }
    }

    return cubes
}