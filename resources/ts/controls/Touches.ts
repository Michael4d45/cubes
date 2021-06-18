interface Position {
    x: number,
    y: number
}

interface TouchFunction {
    (touch: TouchPoint): void
}

class TouchPoint {
    parent: Touches;
    touch: Touch;

    startTime: number = 0;
    deltaTime: number = 0;
    startPos: Position = { x: 0, y: 0 };
    curPos: Position = { x: 0, y: 0 };
    deltaX: number = 0;
    deltaY: number = 0;
    eventType: string = "press";
    state: string = "init";

    longPressesTimeout: number | undefined;

    constructor(parent: Touches, touch: Touch) {
        this.parent = parent;
        this.touch = touch;
    }

    start(touch: Touch) {
        this.touch = touch;
        this.state = "start";
        this.eventType = "press";
        this.startTime = performance.now();
        this.setPos(this.startPos, touch);
        this.setCurPos(touch);

        const scope = this;

        this.longPressesTimeout = window.setTimeout(function () {
            if (scope.state == "start")
                scope.eventType = "longPress";
        }, this.parent.longPressThreshold)
    }

    setPos(pos: Position, touch: Touch) {
        pos.x = touch.pageX - this.parent.el.offsetLeft;
        pos.y = touch.pageY - this.parent.el.offsetTop;
    }

    setCurPos(touch: Touch) {
        this.setPos(this.curPos, touch);
        this.deltaX = this.curPos.x - this.startPos.x;
        this.deltaY = this.curPos.y - this.startPos.y;
        this.deltaTime = performance.now() - this.startTime;
    }

    move(touch: Touch) {
        this.state = "move";
        this.eventType = "pan";
        this.setCurPos(touch);
        this.parent.pans.forEach((callback) => { callback(this); });
    }

    end(touch: Touch) {
        if (this.longPressesTimeout !== undefined)
            clearTimeout(this.longPressesTimeout)

        this.state = "end";

        this.setCurPos(touch);
        switch (this.eventType) {
            case "pan": {
                this.parent.endpans.forEach((callback) => { callback(this); });
            }
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
    endpans: Array<Function> = [];
    presses: Array<Function> = [];
    longPresses: Array<Function> = [];

    longPressThreshold: number = 5000;

    constructor(domObject: HTMLElement) {
        this.el = domObject;

        const scope = this;

        this.el.addEventListener('touchstart', function (e: TouchEvent) {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (!scope.points.has(touch.identifier)) {
                    scope.points.set(touch.identifier, new TouchPoint(scope, touch));
                }
                const touchPoint = scope.points.get(touch.identifier);
                touchPoint?.start(touch)
            }
        });

        this.el.addEventListener('touchmove', function (e: TouchEvent) {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (!scope.points.has(touch.identifier)) {
                    throw "move without start";
                }
                const touchPoint = scope.points.get(touch.identifier);
                touchPoint?.move(touch)
            }
        });

        this.el.addEventListener('touchend', function (e: TouchEvent) {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (!scope.points.has(touch.identifier)) {
                    throw "end without start";
                }
                const touchPoint = scope.points.get(touch.identifier);
                touchPoint?.end(touch)
            }
        });
    }

    on(eventType: string, callback: TouchFunction) {
        switch (eventType) {
            case "pan": {
                this.pans.push(callback)
            }
            case "endpan": {
                this.endpans.push(callback)
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

export { Touches, TouchPoint }