import {
	BufferAttribute,
	BoxGeometry
} from 'three';

const s = 0.5;
const perChunk = 16;

onmessage = function (e) {
  const X = e.data[0];
  const Y = e.data[1];
  const Z = e.data[2];
  let geometries = [];

  for (let x = 0; x < perChunk; x++) {
      for (let y = 0; y < perChunk; y++) {
          for (let z = 0; z < perChunk; z++) {
              const geometry = new BoxGeometry(s, s, s);
              geometry.translate(x + (X * perChunk), y + (Y * perChunk), z + (Z * perChunk));

              const rgb = [
                  Math.random() * 255,
                  Math.random() * 255,
                  Math.random() * 255
              ];

              // make an array to store colors for each vertex
              const numVerts = geometry.getAttribute('position').count;
              const itemSize = 3;  // r, g, b
              const colors = new Uint8Array(itemSize * numVerts);

              // copy the color into the colors array for each vertex
              colors.forEach((v, ndx) => {
                  colors[ndx] = rgb[ndx % 3];
              });

              const normalized = true;
              const colorAttrib = new BufferAttribute(colors, itemSize, normalized);
              geometry.setAttribute('color', colorAttrib);

              geometries.push(geometry);
          }
      }
  }
  postMessage(geometries);
}