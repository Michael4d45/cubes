import { BufferAttribute, ObjectLoader } from "three";

export function loadCubes(cubes) {
    const loader = new ObjectLoader();

    const loadCubes = new Worker('./js/loadCubesWorker.js');
    let count = 0;
    let t1, t2;
    t1 = false;
    let ave = 0;
    loadCubes.onmessage = function (e) {
        if (!e.data)
            return;

        const mesh = loader.parse(e.data);

        cubes.add(mesh);

        count += mesh.count;
        if (!t1) {
            t1 = performance.now();
        }
        else {
            t2 = performance.now();
            ave = Math.round(count / ((t2 - t1) / 1000));
        }
        console.log(count, ave);
    }

    const hDistance = 4;
    const vDistance = 2;
    const checkDistance = hDistance * hDistance;
    for (let y = vDistance; y >= -vDistance; y--) {
        let x = 0;
        let z = 0;
        let incX = true;
        let inc = 1;
        let limit = 1;
        while (Math.abs(x) <= hDistance || Math.abs(z) <= hDistance) {
            if ((x * x + y * y + z * z) <= checkDistance)
                loadCubes.postMessage([x, y, z])

            if (incX) {
                x += inc;
                if (Math.abs(x) >= limit)
                    incX = false;
            }
            else {
                z += inc;
                if (Math.abs(z) >= limit) {
                    incX = true;
                    inc *= -1
                    if (inc == 1)
                        limit++
                }
            }
        }
    }
}