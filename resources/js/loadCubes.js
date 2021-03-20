import { ObjectLoader } from "three";

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

        if (!t1) {
            t1 = performance.now();
        }
        else {
            t2 = performance.now();
            ave = Math.round(count / ((t2 - t1) / 1000));
        }
        count += e.data[1];
        console.log(count, ave);

        const mesh = loader.parse(e.data[0]);
        cubes.add(mesh);
        //console.log(cubes);
    }

    const distance = 4;
    const checkDistance = distance * distance;
    for (let y = distance; y >= -distance; y--) {
        let x = 0;
        let z = 0;
        let incX = true;
        let inc = 1;
        let limit = 1;
        while (Math.abs(x) <= distance || Math.abs(z) <= distance) {
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