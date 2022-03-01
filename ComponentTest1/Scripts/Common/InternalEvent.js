"use strict";
exports.__esModule = true;
exports.InternalEvent = void 0;
var InternalEvent = (function () {
    function InternalEvent() {
    }
    InternalEvent.Register = function (actionName, action) {
        if (!InternalEvent.store[actionName]) {
            InternalEvent.store[actionName] = [];
        }
        InternalEvent.store[actionName].push(action);
    };
    InternalEvent.Invoke = function (actionName, element, data) {
        var actions = InternalEvent.store[actionName];
        if (!actions) {
            return;
        }
        for (var i = 0; i < actions.length; i++) {
            actions[i](element, data);
        }
    };
    InternalEvent.store = {};
    return InternalEvent;
}());
exports.InternalEvent = InternalEvent;
//# sourceMappingURL=InternalEvent.js.map