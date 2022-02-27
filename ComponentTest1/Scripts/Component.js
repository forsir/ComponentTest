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
define(["require", "exports", "./EventsListener", "./BroadcastData", "./RenderQueue", "mustache", "./RootComponent"], function (require, exports, EventsListener_1, BroadcastData_1, RenderQueue_1, mustache_1, RootComponent_1) {
    "use strict";
    exports.__esModule = true;
    exports.Component = exports.EvtSource = void 0;
    var __uid = 0;
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
    var Component = (function () {
        function Component(opts) {
            if (opts === void 0) { opts = {}; }
            this.children = {};
            this.state = {};
            this._isDirty = true;
            this.eventSrc = new EvtSource();
            if (opts.state) {
                this.setState(opts.state);
            }
            this.onCreated();
        }
        Component.prototype.getId = function () {
            if (!this.cid) {
                this.cid = "mqC-" + ++__uid;
            }
            return this.cid;
        };
        Component.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        Component.prototype.getParent = function () {
            return this.parent;
        };
        Component.prototype.mount = function ($element) {
            this.onBeforeMount($element);
            var id = this.getId();
            if (!$element.id) {
                $element.id = id;
            }
            else {
                id = $element.id;
            }
            this.cid = id;
            this.$element = $element;
            this._eventResolver = new EventsListener_1.EventsListener(this);
            this.onMount();
        };
        Component.prototype.unmount = function () {
            this.eventSrc.remove();
            this._eventResolver.remove();
            for (var key in this.children) {
                var child = this.children[key];
                child.unmount();
            }
            this.onUnmount();
        };
        Component.prototype.markDirty = function (isDirty) {
            if (isDirty === void 0) { isDirty = true; }
            this._isDirty = isDirty;
        };
        Component.prototype.isDirty = function () {
            return this._isDirty;
        };
        Component.prototype.setElement = function (element) {
            this.$element = element;
        };
        Component.prototype.getElement = function () {
            return this.$element || document.getElementById(this.getId());
        };
        Component.prototype.hasElement = function () {
            return !!this.$element;
        };
        Component.prototype.addChild = function (child) {
            child.setParent(this);
            this.children[child.getId()] = child;
        };
        Component.prototype.deleteChild = function (idx) {
            var child = this.children[idx];
            if (!child) {
                throw Error("Child " + idx + " not found");
            }
            var $el = child.getElement();
            if ($el) {
                this.$element.removeChild($el);
            }
            this.children[idx] = undefined;
        };
        Component.prototype.deleteAllChildren = function () {
            for (var key in this.children) {
                var child = this.children[key];
                var $el = child.getElement();
                if ($el) {
                    try {
                        this.$element.removeChild($el);
                    }
                    catch (e) {
                    }
                }
            }
            this.children = {};
        };
        Component.prototype.getChildren = function () {
            return this.children;
        };
        Component.prototype.findChild = function (id) {
            return this.children[id];
        };
        Component.prototype.on = function (event, listener) {
            return this._eventResolver.addEventListener(event, listener);
        };
        Component.prototype.off = function (event) {
            return this._eventResolver.removeEventListener(event);
        };
        Component.prototype.render = function () {
            var needRender = this.isDirty();
            if (this.parent) {
                needRender = needRender && !this.parent.isDirty();
            }
            if (needRender) {
                this.onBeforeRender();
                this._render();
                this.onAfterRender();
            }
            this.onAfterChildrenRendered();
        };
        Component.prototype.getTemplate = function () {
            return null;
        };
        Component.prototype.onBroadcast = function (ed) {
        };
        Component.prototype.broadcast = function () {
            var actions = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                actions[_i] = arguments[_i];
            }
            var ed = new BroadcastData_1.BroadcastData(this, actions);
            RootComponent_1.RootComponent.root.walk(function (component) {
                if (component['onBroadcast'] !== undefined) {
                    component['onBroadcast'](ed);
                }
            });
            return this;
        };
        Component.prototype.walk = function (callback) {
            for (var key in this.children) {
                var child = this.children[key];
                child.walk(callback);
            }
            callback(this);
            return this;
        };
        Component.prototype.onCreated = function () {
        };
        Component.prototype.onBeforeMount = function ($element) {
        };
        Component.prototype.onMount = function () {
        };
        Component.prototype.onUnmount = function () {
        };
        Component.prototype.onBeforeRender = function () {
        };
        Component.prototype.onAfterRender = function () {
        };
        Component.prototype.onBeforeUpdate = function () {
        };
        Component.prototype.onAfterUpdate = function () {
        };
        Component.prototype.onAfterChildrenRendered = function () {
        };
        Component.prototype.update = function (state) {
            if (JSON.stringify(state) !== JSON.stringify(this.state)) {
                this.markDirty();
            }
            this.setState(state);
            (0, RenderQueue_1.enqueueRender)(this);
        };
        Component.prototype.updateStateProperties = function (properties) {
            var state = __assign(__assign({}, this.state), properties);
            this.update(state);
        };
        Component.prototype.getState = function () {
            return __assign({}, this.state);
        };
        Component.prototype.setState = function (state) {
            this.onBeforeUpdate();
            this.state = __assign({}, state);
            this.onAfterUpdate();
        };
        Component.prototype.show = function () {
            this.getElement().style.display = "block";
        };
        Component.prototype.hide = function () {
            this.getElement().style.display = "none";
        };
        Component.prototype.isShown = function () {
            return this.getElement().style.display == "block";
        };
        Component.prototype.addClassName = function (className) {
            if (this.hasClassName(className)) {
                return;
            }
            this.getElement().className += ' ' + className;
        };
        Component.prototype.removeClassName = function (className) {
            var $el = this.getElement();
            $el.className = $el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        };
        Component.prototype.hasClassName = function (className) {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.getElement().className);
        };
        Component.prototype.getRoute = function () {
            return location.hash.replace('#/', '');
        };
        Component.prototype.getRenderedChildren = function () {
            return {};
        };
        Component.prototype.getRenderedContent = function () {
            var template = this.getTemplate();
            this.markDirty(false);
            if (template) {
                var partials;
                var state = __assign(__assign({}, this.state), this.getRenderedChildren());
                return '<div id="' + this.getId() + '">' + (0, mustache_1.render)(template, state, partials) + '</div>';
            }
        };
        Component.prototype._render = function () {
            this.markDirty(false);
            var template = this.getTemplate();
            if (template) {
                var rendered = this.getRenderedContent();
                var element = document.getElementById(this.getId());
                if (element) {
                    if (element.innerHTML !== rendered) {
                        element.innerHTML = rendered;
                    }
                }
            }
        };
        return Component;
    }());
    exports.Component = Component;
});
//# sourceMappingURL=Component.js.map