interface Position {
    x: number,
    y: number
}

class TouchPoint {
    parent: Touches;

    startTime: number = 0;
    deltaTime: number = 0;
    startPos: Position = { x: 0, y: 0 };
    curPos: Position = { x: 0, y: 0 };
    deltaX: number = 0;
    deltaY: number = 0;
    eventType: string = "press";
    state: string = "init";

    longPressesTimeout: number | undefined;

    constructor(parent: Touches, e: TouchEvent) {
        this.parent = parent;
        this.start(e)
    }

    start(e: TouchEvent) {
        this.state = "start";
        this.eventType = "press";
        this.startTime = performance.now();
        this.deltaTime = 0;
        this.setPos(this.startPos, e);
        this.setPos(this.curPos, e);
        this.deltaX = 0;
        this.deltaY = 0;

        const scope = this;

        this.longPressesTimeout = window.setTimeout(function () {
            if (scope.state == "start")
                scope.eventType = "longPress";
        }, this.parent.longPressThreshold)
    }

    setPos(pos: Position, e: TouchEvent) {
        pos.x = e.touches[0].pageX - this.parent.el.offsetLeft;
        pos.y = e.touches[0].pageY - this.parent.el.offsetTop;
    }

    touchmove(e: TouchEvent) {
        console.log(e);
        this.state = "move";
        this.eventType = "pan";
        this.setPos(this.curPos, e);
        this.deltaX = this.curPos.x - this.startPos.x;
        this.deltaY = this.curPos.y - this.startPos.y;

        this.deltaTime = performance.now() - this.startTime;
        //this.parent.pans.forEach((callback) => { callback(this) });
    }

    touchend() {
        if (this.longPressesTimeout !== undefined)
            clearTimeout(this.longPressesTimeout)

        this.state = "end";

        this.deltaTime = performance.now() - this.startTime;
        switch (this.eventType) {
            case "press": {
                //scope.presses.forEach((callback) => { callback(scope) });
            }
            case "longPress": {
                //scope.longPresses.forEach((callback) => { callback(scope) });
            }
        }
    }
}

class Touches {
    el: HTMLElement;

    points: Map<number, TouchPoint> = new Map;

    pans: Array<Function> = [];
    presses: Array<Function> = [];
    longPresses: Array<Function> = [];

    longPressThreshold: number = 5000;

    constructor(domObject: HTMLElement) {
        this.el = domObject;

        const scope = this;

        this.el.addEventListener('touchstart', function (e) {
            console.log("start", e);
            let touchPoint = new TouchPoint(scope, e);
        });

        this.el.addEventListener('touchmove', function (e) {

            console.log("move", e);
        });

        this.el.addEventListener('touchend', function (e) {

            console.log("end", e);
        });
    }

    on(eventType: string, callback: Function) {
        switch (eventType) {
            case "pan": {
                this.pans.push(callback)
            }
            case "press": {
                this.presses.push(callback)
            }
            case "longPress": {
                this.longPresses.push(callback)
            }
        }
    }
}

export default Touches