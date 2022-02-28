"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.BroadcastData = void 0;
var BroadcastData = (function () {
    function BroadcastData(sender, actions) {
        this.actions = {};
        this.sender = sender;
        for (var i = 0, l = actions.length; i < l; i++) {
            var action = actions[i];
            if (typeof action === "string") {
                this.actions[action] = null;
            }
            else {
                this.actions = __assign(__assign({}, this.actions), action);
            }
        }
    }
    BroadcastData.prototype.hasAction = function () {
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        for (var i = 0, l = classes.length; i < l; i++) {
            var a = classes[i];
            if (this.actions[a] !== undefined) {
                return true;
            }
        }
        return false;
    };
    BroadcastData.prototype.getAction = function (action) {
        return (this.actions[action] !== undefined) ? this.actions[action] : null;
    };
    return BroadcastData;
}());
exports.BroadcastData = BroadcastData;
//# sourceMappingURL=BroadcastData.js.map