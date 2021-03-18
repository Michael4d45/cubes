import {
    BufferAttribute,
    BoxGeometry,
    Mesh,
    MeshBasicMaterial
} from 'three';
import { BufferGeometryUtils } from './BufferGeometryUtils'

const s = 0.5;
const perChunk = 100;

const density = 0.005;

const box = new BoxGeometry(s, s, s);

const numVerts = box.getAttribute('position').count;
const itemSize = 3;  // r, g, b
const normalized = true;

const material = new MeshBasicMaterial({
    vertexColors: true,
});

onmessage = function (e) {
    const X = e.data[0];
    const Y = e.data[1];
    const Z = e.data[2];
    let geometries = [];

    for (let x = 0; x < perChunk; x++) {
        for (let y = 0; y < perChunk; y++) {
            for (let z = 0; z < perChunk; z++) {
                if (Math.random() > (density)) continue;
                const geometry = box.clone();
                geometry.translate(x + (X * perChunk), y + (Y * perChunk), z + (Z * perChunk));

                const rgb = [
                    Math.random() * 255,
                    Math.random() * 255,
                    Math.random() * 255
                ];

                const colors = new Uint8Array(itemSize * numVerts);

                // copy the color into the colors array for each vertex
                colors.forEach((v, ndx) => {
                    colors[ndx] = rgb[ndx % 3];
                });

                const colorAttrib = new BufferAttribute(colors, itemSize, normalized);
                geometry.setAttribute('color', colorAttrib);

                geometries.push(geometry);
            }
        }
    }
    if(geometries.length == 0)
        postMessage(false)

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
        geometries, false);
        
    const mesh = new Mesh(mergedGeometry, material);
    postMessage(mesh.toJSON());
}