var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Logger", ["require", "exports"], function (require, exports) {
    "use strict";
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
});
define("EventsListener", ["require", "exports", "Logger"], function (require, exports, Logger_1) {
    "use strict";
    exports.__esModule = true;
    exports.EventsListener = void 0;
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
            else if (typeof this.listener['on' + event.toLowerCase()] === 'function') {
                return 'on' + event.toLowerCase();
            }
            else if (typeof this.listener['on' + event] === 'function') {
                return 'on' + event;
            }
            return undefined;
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
});
define("BroadcastData", ["require", "exports"], function (require, exports) {
    "use strict";
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
});
define("RenderQueue", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.rerender = exports.enqueueRender = exports.clearRender = void 0;
    var items = [];
    function clearRender() {
        items = [];
    }
    exports.clearRender = clearRender;
    function enqueueRender(component) {
        if (component.isDirty() && items.push(component) == 1) {
            window.setTimeout(rerender, 0);
        }
    }
    exports.enqueueRender = enqueueRender;
    function rerender() {
        var component, list = items;
        items = [];
        for (var i in list) {
            component = list[i];
            if (component.isDirty() && !component.getParent().isDirty()) {
                component.render();
            }
        }
    }
    exports.rerender = rerender;
});
define("Component", ["require", "exports", "EventsListener", "BroadcastData", "RenderQueue", "mustache", "RootComponent"], function (require, exports, EventsListener_1, BroadcastData_1, RenderQueue_1, mustache_1, RootComponent_1) {
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
define("DOM", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.DOM = void 0;
    var DOM = (function () {
        function DOM() {
        }
        DOM.define = function (tagName, clazz) {
            clazz.tag(tagName);
            DOM.customElements[tagName] = clazz;
        };
        DOM.getDefinedTags = function () {
            var tags = [];
            for (var name_1 in DOM.customElements) {
                tags.push(name_1);
            }
            return tags;
        };
        DOM.getTagObject = function (tagName) {
            if (!DOM.customElements) {
                return undefined;
            }
            return DOM.customElements[tagName];
        };
        DOM.mount = function (root, $subTree) {
            var $rootElement = $subTree || root.getElement();
            var id = $rootElement.id;
            var idParts = id.split(".");
            if (idParts.length > 1) {
                id = idParts.join("\\.");
            }
            var selectors = [];
            for (var name_2 in DOM.customElements) {
                selectors.push("#" + id + " " + name_2);
            }
            selectors.push("#" + id + " " + '[data-is]');
            var selector = selectors.join(', ');
            var $elements = $rootElement.getElementsByTagName("div");
            root.deleteAllChildren();
            for (var j = 0, count = $elements.length; j < count; j++) {
                var $e = $elements[j];
                if (($e instanceof HTMLElement)) {
                    DOM.mountElement(root, $e);
                }
            }
        };
        DOM.mountElement = function (parent, $element) {
            var hydratedAttrName = "data-myqhydrated";
            if ($element.hasAttribute(hydratedAttrName)) {
                return;
            }
            var className = DOM.getClassName($element);
            if (!className) {
                return null;
            }
            var c = DOM.getComponentClass(className);
            if (c === undefined) {
                $element.setAttribute(hydratedAttrName, "");
                return null;
            }
            var component = new c();
            component.mount($element);
            parent.addChild(component);
            return component;
        };
        DOM.getState = function (element) {
            var state = element.getAttribute('data-state') || null;
            if (state) {
                state = state.replace("\\\'", "\'");
            }
            return JSON.parse(state);
        };
        DOM.getClassName = function (element) {
            var className = element.localName.toLowerCase();
            var constructor = DOM.getTagObject(className);
            if (constructor !== undefined) {
                return className;
            }
            return element.getAttribute('data-is');
        };
        DOM.getComponentClass = function (className) {
            return DOM.getTagObject(className);
        };
        DOM.customElements = {};
        return DOM;
    }());
    exports.DOM = DOM;
});
define("HeaderComponent", ["require", "exports", "Component"], function (require, exports, Component_1) {
    "use strict";
    exports.__esModule = true;
    exports.HeaderComponent = void 0;
    var HeaderComponent = (function (_super) {
        __extends(HeaderComponent, _super);
        function HeaderComponent(opts) {
            return _super.call(this, opts) || this;
        }
        HeaderComponent.prototype.getTemplate = function () {
            return "<div style=\"border: 1px solid black\">{{title}}</div>";
        };
        return HeaderComponent;
    }(Component_1.Component));
    exports.HeaderComponent = HeaderComponent;
});
define("ItemComponent", ["require", "exports", "Component"], function (require, exports, Component_2) {
    "use strict";
    exports.__esModule = true;
    exports.ItemComponent = void 0;
    var ItemComponent = (function (_super) {
        __extends(ItemComponent, _super);
        function ItemComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ItemComponent;
    }(Component_2.Component));
    exports.ItemComponent = ItemComponent;
});
define("TextItemComponent", ["require", "exports", "ItemComponent"], function (require, exports, ItemComponent_1) {
    "use strict";
    exports.__esModule = true;
    exports.TextItemComponent = void 0;
    var TextItemComponent = (function (_super) {
        __extends(TextItemComponent, _super);
        function TextItemComponent(opts) {
            var _this = _super.call(this, opts) || this;
            _this.props = opts;
            return _this;
        }
        TextItemComponent.prototype.getTemplate = function () {
            return "<span style=\"font-weight:bold\">{{description}}:</span>\n                <span>{{value}}</span>";
        };
        return TextItemComponent;
    }(ItemComponent_1.ItemComponent));
    exports.TextItemComponent = TextItemComponent;
});
define("ListComponent", ["require", "exports", "Component", "TextItemComponent"], function (require, exports, Component_3, TextItemComponent_1) {
    "use strict";
    exports.__esModule = true;
    exports.ListComponent = void 0;
    var ListComponent = (function (_super) {
        __extends(ListComponent, _super);
        function ListComponent(opts) {
            var _this = _super.call(this, opts) || this;
            _this.items = opts.items.map(function (item) { return new TextItemComponent_1.TextItemComponent(item); });
            return _this;
        }
        ListComponent.prototype.getTemplate = function () {
            return "{{#itemComponents}}\n                * {{getRenderedContent}}\n                {{/items}}";
        };
        return ListComponent;
    }(Component_3.Component));
    exports.ListComponent = ListComponent;
});
define("PageComponent", ["require", "exports", "Component", "HeaderComponent", "ListComponent"], function (require, exports, Component_4, HeaderComponent_1, ListComponent_1) {
    "use strict";
    exports.__esModule = true;
    exports.PageComponent = void 0;
    var PageComponent = (function (_super) {
        __extends(PageComponent, _super);
        function PageComponent(opts) {
            var _this = _super.call(this, opts) || this;
            _this.header = new HeaderComponent_1.HeaderComponent(opts.header);
            _this.list = new ListComponent_1.ListComponent(opts.list);
            return _this;
        }
        PageComponent.prototype.getRenderedChildren = function () {
            return {
                header: this.header.getRenderedContent(),
                list: this.list.getRenderedContent()
            };
        };
        PageComponent.prototype.getTemplate = function () {
            return "<div>{{header}}</div>\n                <div>{{list}}</div>";
        };
        return PageComponent;
    }(Component_4.Component));
    exports.PageComponent = PageComponent;
});
define("RootComponent", ["require", "exports", "Component"], function (require, exports, Component_5) {
    "use strict";
    exports.__esModule = true;
    exports.RootComponent = void 0;
    var RootComponent = (function (_super) {
        __extends(RootComponent, _super);
        function RootComponent(opts) {
            if (opts === void 0) { opts = {}; }
            return _super.call(this, opts) || this;
        }
        return RootComponent;
    }(Component_5.Component));
    exports.RootComponent = RootComponent;
});
define("App", ["require", "exports", "RootComponent"], function (require, exports, RootComponent_2) {
    "use strict";
    exports.__esModule = true;
    window.addEventListener('load', function (event) {
        var rootElement = document.getElementById("app");
        rootElement.innerHTML = "inner element: <div id='inner'>Jedna</div> konec";
        var rootElement1 = document.getElementById("inner");
        rootElement1.innerHTML = "Dva";
        rootElement.innerHTML = "inner element změna: <div id='inner'>Jedna</div> konec";
        rootElement1.innerHTML = "Tři";
        var rootComponent = new RootComponent_2.RootComponent();
        var rootElement = document.getElementById("app");
        rootComponent.setElement(rootElement);
        rootComponent.render();
    });
});
//# sourceMappingURL=app1.js.map