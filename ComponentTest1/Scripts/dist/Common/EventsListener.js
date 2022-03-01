"use strict";
exports.__esModule = true;
exports.EventsListener = void 0;
var Logger_1 = require("./Logger");
var EventsListener = (function () {
    function EventsListener(listener) {
        this.events = {};
        this.listener = listener;
    }
    EventsListener.prototype.addEventListener = function (event, listener) {
        var $e = this.listener.getElement();
        listener = this.resolveListener(listener, event);
        if (!listener) {
            throw new Error("Invalid event listener " + listener.toString());
        }
        this.events[event] = listener;
        Logger_1.Logger.debug('listening', "#" + $e.id, event);
        return $e.addEventListener(event, this, false);
    };
    EventsListener.prototype.removeEventListener = function (event) {
        var $e = this.listener.getElement();
        var listener = this.events[event];
        if (!listener) {
            return;
        }
        delete this.events[event];
        return $e.removeEventListener(event, this.resolveListener(listener, event));
    };
    EventsListener.prototype.remove = function () {
    };
    EventsListener.prototype.handleEvent = function (e) {
        var eventType = e.type;
        var listener = this.events[eventType];
        if (listener === undefined) {
            return;
        }
        if (e instanceof MutationEvent) {
            if (e.relatedNode !== this.listener.getElement()) {
                return;
            }
        }
        this.callListener(eventType, e);
    };
    EventsListener.prototype.resolveListener = function (listener, event) {
        if (typeof listener === 'function') {
            return listener;
        }
        else if (typeof listener === 'string' && typeof this.listener[listener] === 'function') {
            return listener;
        }
        else if (typeof this.listener['on' + this.ucFirst(event)] === 'function') {
            return 'on' + this.ucFirst(event);
        }
        else if (typeof this.listener['on' + event.toLowerCase()] === 'function') {
            return 'on' + event.toLowerCase();
        }
        else if (typeof this.listener['on' + event] === 'function') {
            return 'on' + event;
        }
        return undefined;
    };
    EventsListener.prototype.ucFirst = function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
    EventsListener.prototype.callListener = function (eventType, event) {
        var listener = this.events[eventType];
        if (typeof listener === 'function') {
            listener(event);
        }
        else {
            this.listener[listener](event);
        }
    };
    return EventsListener;
}());
exports.EventsListener = EventsListener;
//# sourceMappingURL=EventsListener.js.map