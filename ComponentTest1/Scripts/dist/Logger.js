"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Logger = void 0;
var Logger = (function () {
    function Logger() {
    }
    Logger.enable = function (enable) {
        Logger.isEnabled = enable;
    };
    Logger.debug = function (msg) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        Logger.log.apply(Logger, __spreadArray([msg, 'debug'], optionalParams, false));
    };
    Logger.info = function (msg) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        Logger.log.apply(Logger, __spreadArray([msg, 'info'], optionalParams, false));
    };
    Logger.warn = function (msg) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        Logger.log.apply(Logger, __spreadArray([msg, 'warn'], optionalParams, false));
    };
    Logger.error = function (msg) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        Logger.log.apply(Logger, __spreadArray([msg, 'error'], optionalParams, false));
    };
    Logger.log = function (msg, type) {
        var optionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            optionalParams[_i - 2] = arguments[_i];
        }
        if (!Logger.isEnabled) {
            return;
        }
        switch (type) {
            case 'debug':
                console.debug.apply(console, __spreadArray([msg], optionalParams, false));
                break;
            case 'info':
                console.info.apply(console, __spreadArray([msg], optionalParams, false));
                break;
            case 'warn':
                console.warn.apply(console, __spreadArray([msg], optionalParams, false));
                break;
            case 'error':
                console.error.apply(console, __spreadArray([msg], optionalParams, false));
                break;
            default:
                console.log.apply(console, __spreadArray([msg], optionalParams, false));
        }
    };
    Logger.stringifyParam = function (param) {
        var text;
        alert("2");
        if (param instanceof HTMLElement) {
            var tagName = param.localName.toLowerCase();
            text = " &lt;" + tagName
                + (param.id ? " id=\"" + param.id + "\"" : "")
                + (param.getAttribute('data-is') ? " data-is=\"" + param.getAttribute('data-is') + "\"" : "")
                + "&gt;";
        }
        else if (param === null) {
            text = "NULL";
        }
        else if (param instanceof Object) {
            text = "<i>" + param.toString() + "</i>";
        }
        else {
            text = " " + param.toString();
        }
        return " | " + text;
    };
    Logger.isEnabled = false;
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map