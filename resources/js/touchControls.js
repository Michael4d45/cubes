const Hammer = require('hammerjs');

let hammer;

function setControls(camera, canvas, play, lock, unlock) {
    alert("using touch controls");
    hammer = new Hammer(canvas);
    play.addEventListener('click', function () {
        lock();
        document.body.requestFullscreen();
    });

    document.body.onfullscreenchange = function () {
        if (!document.fullscreenElement)
            unlock()
    }

}

function moveCamera(delta) {

}

export { setControls, moveCamera }