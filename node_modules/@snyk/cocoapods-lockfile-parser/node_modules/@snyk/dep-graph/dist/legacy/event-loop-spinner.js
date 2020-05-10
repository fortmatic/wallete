"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventLoopSpinner {
    constructor(thresholdMs = 10) {
        this.thresholdMs = thresholdMs;
        this.afterLastSpin = Date.now();
    }
    isStarving() {
        return Date.now() - this.afterLastSpin > this.thresholdMs;
    }
    reset() {
        this.afterLastSpin = Date.now();
    }
    async spin() {
        return new Promise((resolve) => setImmediate(() => {
            this.reset();
            resolve();
        }));
    }
}
exports.EventLoopSpinner = EventLoopSpinner;
//# sourceMappingURL=event-loop-spinner.js.map