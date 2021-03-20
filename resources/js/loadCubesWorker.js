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

const count = Math.pow(perChunk, 3);
const matrix = new Matrix4();
const color = new Color();

onmessage = function (e) {
    const X = e.data[0];
    const Y = e.data[1];
    const Z = e.data[2];

    const mesh = new InstancedMesh(box, material, count);
    let i = 0;
    for (let x = 0; x < perChunk; x++) {
        for (let y = 0; y < perChunk; y++) {
            for (let z = 0; z < perChunk; z++) {
                if(Math.random() > density) continue;
                matrix.setPosition(x + (X * perChunk), y + (Y * perChunk), z + (Z * perChunk));

                mesh.setMatrixAt(i, matrix);
                mesh.setColorAt(i, color.setHex(Math.random() * 0xffffff));

                i++
            }
        }
    }
    mesh.count = i;

    postMessage([mesh.toJSON(), mesh.instanceColor.toJSON()]);
}