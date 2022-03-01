"use strict";
exports.__esModule = true;
exports.EvtSource = void 0;
var EvtSource = (function () {
    function EvtSource() {
        this.listeners = {};
    }
    EvtSource.prototype.open = function (url) {
        if (this.evtSource) {
            this.remove();
        }
        this.evtSource = new EventSource(url);
    };
    EvtSource.prototype.addListener = function (type, callback, options) {
        this.evtSource.addEventListener(type, callback, options);
        this.listeners[type] = callback;
    };
    EvtSource.prototype.close = function () {
        if (!this.evtSource)
            return;
        this.evtSource.close();
    };
    EvtSource.prototype.remove = function () {
        var _this = this;
        if (!this.evtSource)
            return;
        Object.keys(this.listeners).forEach(function (key) {
            _this.evtSource.removeEventListener(key, _this.listeners[key]);
        });
        this.listeners = {};
        this.evtSource.close();
        this.evtSource = null;
    };
    EvtSource.prototype.onError = function (callback) {
        this.evtSource.onerror = callback;
    };
    return EvtSource;
}());
exports.EvtSource = EvtSource;
//# sourceMappingURL=EvtSource.js.map