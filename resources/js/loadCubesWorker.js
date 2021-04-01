import {
    BoxGeometry,
    InstancedMesh,
    Matrix4,
    Color,
    MeshPhongMaterial
} from 'three';

const s = 1;
const perChunk = 16;

const density = 0.05;

const box = new BoxGeometry(s, s, s);

const material = new MeshPhongMaterial();

const matrix = new Matrix4();
const color = new Color();

onmessage = function (e) {
    const X = e.data[0];
    const Y = e.data[1];
    const Z = e.data[2];

    const cubeData = spoofData(X, Y, Z);

    const mesh = new InstancedMesh(box, material, cubeData.count);
    for (let i = 0; i < cubeData.count; i++) {
        const cube = cubeData.array[i];
        matrix.setPosition(cube.position.x, cube.position.y, cube.position.z);

        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, color.setHex(cube.attributes.color));
    }

    postMessage([mesh.toJSON(), mesh.instanceColor ? mesh.instanceColor.toJSON() : null]);
}

function spoofData(X, Y, Z) {
    const cubes = {
        array: [],
        count: 0
    }
    
    const hexColor = Math.random() * 0xffffff;
    for (let x = 0; x < perChunk; x++) {
        for (let y = 0; y < perChunk; y++) {
            for (let z = 0; z < perChunk; z++) {
                if(Math.random() > density) continue;
                cubes.array.push({
                    position: {
                        x: x + (X * perChunk),
                        y: y + (Y * perChunk),
                        z: z + (Z * perChunk)
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