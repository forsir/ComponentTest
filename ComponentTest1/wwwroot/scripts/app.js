define(["require", "exports", "./RootComponent"], function (require, exports, RootComponent_1) {
    "use strict";
    exports.__esModule = true;
    window.addEventListener('load', function (event) {
        var rootElement = document.getElementById("app");
        rootElement.innerHTML = "inner element: <div id='inner'>Jedna</div> konec";
        var rootElement1 = document.getElementById("inner");
        rootElement1.innerHTML = "Dva";
        rootElement.innerHTML = "inner element změna: <div id='inner'>Jedna</div> konec";
        rootElement1.innerHTML = "Tři";
        var rootComponent = new RootComponent_1.RootComponent();
        var rootElement = document.getElementById("app");
        rootComponent.setElement(rootElement);
        rootComponent.render();
    });
});
//# sourceMappingURL=App.js.map
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
define(["require", "exports"], function (require, exports) {
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
//# sourceMappingURL=BroadcastData.js.map
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
define(["require", "exports"], function (require, exports) {
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
//# sourceMappingURL=DOM.js.map
define(["require", "exports", "./Logger"], function (require, exports, Logger_1) {
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
//# sourceMappingURL=EventsListener.js.map
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
define(["require", "exports", "./Component"], function (require, exports, Component_1) {
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
//# sourceMappingURL=HeaderComponent.js.map
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
define(["require", "exports", "./Component"], function (require, exports, Component_1) {
    "use strict";
    exports.__esModule = true;
    exports.ItemComponent = void 0;
    var ItemComponent = (function (_super) {
        __extends(ItemComponent, _super);
        function ItemComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ItemComponent;
    }(Component_1.Component));
    exports.ItemComponent = ItemComponent;
});
//# sourceMappingURL=ItemComponent.js.map
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
define(["require", "exports", "./Component", "./TextItemComponent"], function (require, exports, Component_1, TextItemComponent_1) {
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
    }(Component_1.Component));
    exports.ListComponent = ListComponent;
});
//# sourceMappingURL=ListComponent.js.map
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define(["require", "exports"], function (require, exports) {
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
//# sourceMappingURL=Logger.js.map
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
define(["require", "exports", "./Component", "./HeaderComponent", "./ListComponent"], function (require, exports, Component_1, HeaderComponent_1, ListComponent_1) {
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
    }(Component_1.Component));
    exports.PageComponent = PageComponent;
});
//# sourceMappingURL=PageComponent.js.map
define(["require", "exports"], function (require, exports) {
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
//# sourceMappingURL=RenderQueue.js.map
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
define(["require", "exports", "./Component"], function (require, exports, Component_1) {
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
    }(Component_1.Component));
    exports.RootComponent = RootComponent;
});
//# sourceMappingURL=RootComponent.js.map
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
define(["require", "exports", "./ItemComponent"], function (require, exports, ItemComponent_1) {
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
//# sourceMappingURL=TextItemComponent.js.map
import { RootComponent } from "./RootComponent";

window.addEventListener('load', (event) => {
    var rootElement = document.getElementById("app");
    rootElement.innerHTML = "inner element: <div id='inner'>Jedna</div> konec";
    var rootElement1 = document.getElementById("inner");
    rootElement1.innerHTML = "Dva";
    rootElement.innerHTML = "inner element změna: <div id='inner'>Jedna</div> konec";
    rootElement1.innerHTML = "Tři";

    var rootComponent = new RootComponent();
    var rootElement = document.getElementById("app");
    rootComponent.setElement(rootElement);
    rootComponent.render();
});

export class BroadcastData {
    sender: any;
    actions: any = {};

    constructor(sender: any, actions: any[]) {
        this.sender = sender;

        for (let i = 0, l = actions.length; i < l; i++) {
            let action = actions[i];
            if (typeof action === "string") {
                this.actions[action] = null;
            } else {
                this.actions = { ...this.actions, ...action };
            }
        }
    }

    hasAction(...classes: string[]) {
        for (let i = 0, l = classes.length; i < l; i++) {
            let a: string = classes[i];
            if (this.actions[a] !== undefined) {
                return true;
            }
        }

        return false;
    }

    getAction(action: any) {
        return (this.actions[action] !== undefined) ? this.actions[action] : null;
    }
}

import { EventsListener } from "./EventsListener";
import { BroadcastData } from "./BroadcastData";
import { enqueueRender } from "./RenderQueue";
import { DOM } from "./DOM";
import { render } from 'mustache';
import { RootComponent } from "./RootComponent";

let __uid = 0;

export interface EventListener {
    on(event: string, listener: any): any;

    off(event: string): any;
}

export class EvtSource {
    private evtSource: EventSource;
    private listeners: { [index: string]: any } = {};

    public open(url: string): void {
        if (this.evtSource) {
            this.remove();
        }

        this.evtSource = new EventSource(url);
    }

    public addListener(type: string, callback: (evt: Event) => void, options: boolean | AddEventListenerOptions): void {
        this.evtSource.addEventListener(type, callback, options);
        this.listeners[type] = callback;
    }

    public close(): void {
        if (!this.evtSource) return;
        this.evtSource.close();
    }

    public remove(): void {
        if (!this.evtSource) return;
        Object.keys(this.listeners).forEach((key) => {
            this.evtSource.removeEventListener(key, this.listeners[key]);
        });
        this.listeners = {}
        this.evtSource.close();
        this.evtSource = null;
    }

    public onError(callback: any): void {
        this.evtSource.onerror = callback;
    }
}

export interface ComponentInterface {
    mount($element: HTMLElement): void;

    unmount(): void;

    getId(): string;

    setParent(parent: ComponentInterface): void;

    getParent(): ComponentInterface;

    getTemplate(): string;

    render(): void;

    update(state: object): void;

    updateStateProperties(properties: object): void;

    setElement(element: HTMLElement): void;

    getElement(): HTMLElement;

    hasElement(): boolean;

    addChild(component: ComponentInterface): void;

    deleteChild(idx: number): void;

    deleteAllChildren(): void;

    getChildren(): { [id: string]: ComponentInterface };

    findChild(id: string): ComponentInterface;

    markDirty(isDirty?: boolean): void;

    isDirty(): boolean;

    walk(callback: Function): void;

    getRenderedChildren(): {};
}

export interface ComponentOptions {
    state?: {}
}

export abstract class Component implements ComponentInterface, EventListener {
    protected parent: ComponentInterface;
    protected children: { [id: string]: ComponentInterface } = {};
    protected cid: string;
    private state: object = {};
    private $element: HTMLElement;
    private _isDirty: boolean = true;
    private _eventResolver: EventsListener;

    protected eventSrc: EvtSource = new EvtSource();

    constructor(opts: ComponentOptions = {}) {
        if (opts.state) {
            this.setState(opts.state);
        }

        this.onCreated();
    }

    public getId(): string {
        if (!this.cid) {
            this.cid = "mqC-" + ++__uid;
        }

        return this.cid;
    }

    public setParent(parent: ComponentInterface) {
        this.parent = parent;
    }

    public getParent() {
        return this.parent;
    }

    public mount($element: HTMLElement): void {
        this.onBeforeMount($element);

        let id = this.getId();

        if (!$element.id) {
            $element.id = id;
        } else {
            id = $element.id;
        }

        this.cid = id;
        this.$element = $element;

        this._eventResolver = new EventsListener(this);

        this.onMount();
    }

    public unmount() {
        this.eventSrc.remove();
        this._eventResolver.remove();
        for (let key in this.children) {
            let child = this.children[key];
            child.unmount();
        }
        this.onUnmount();
    }

    public markDirty(isDirty: boolean = true) {
        this._isDirty = isDirty;
    }

    public isDirty() {
        return this._isDirty;
    }

    public setElement(element: HTMLElement) {
        this.$element = element;
    }

    public getElement(): HTMLElement {
        return this.$element || document.getElementById(this.getId());
    }

    public hasElement() {
        return !!this.$element;
    }

    public addChild(child: ComponentInterface) {
        child.setParent(this);
        this.children[child.getId()] = child;
    }

    public deleteChild(idx: number) {
        let child = this.children[idx];

        if (!child) {
            throw Error("Child " + idx + " not found");
        }

        let $el = child.getElement();
        if ($el) {
            this.$element.removeChild($el);
        }

        this.children[idx] = undefined;
    }

    public deleteAllChildren() {
        for (let key in this.children) {
            let child = this.children[key];
            let $el = child.getElement();
            if ($el) {
                try {
                    this.$element.removeChild($el);
                } catch (e) {
                }
            }
        }
        this.children = {};
    }

    public getChildren() {
        return this.children;
    }

    public findChild(id: string) {
        return this.children[id];
    }

    public on(event: string, listener?: any) {
        return this._eventResolver.addEventListener(event, listener);
    }

    public off(event?: string) {
        return this._eventResolver.removeEventListener(event);
    }

    public render(): void {
        let needRender = this.isDirty();
        if (this.parent) {
            needRender = needRender && !this.parent.isDirty();
        }

        if (needRender) {
            this.onBeforeRender();
            this._render();
            this.onAfterRender();
        }

        //for (let key in this.children) {
        //    let child = this.children[key];
        //    child.render();
        //}

        this.onAfterChildrenRendered();
    }

    public getTemplate(): string {
        return null;
    }

    public onBroadcast(ed: BroadcastData) { /* abstract */
    }

    /**
     * You can pass list of actions or a map of action -> data.
     * Examples:
     * - broadcast('action1', 'action2', ...)
     * - broadcast({action1: data, action2: data, ...})
     * @param actions
     * @returns {Component}
     */
    public broadcast(...actions: any[]) {
        let ed = new BroadcastData(this, actions);
        RootComponent.root.walk(function (component: ComponentInterface | any) {
            if (component['onBroadcast'] !== undefined) {
                component['onBroadcast'](ed);
            }
        });

        return this;
    }

    public walk(callback: Function) {
        for (let key in this.children) {
            let child = this.children[key];
            child.walk(callback);
        }
        callback(this);

        return this;
    }

    protected onCreated() { /* abstract */
    }

    protected onBeforeMount($element: HTMLElement) { /* abstract */
    }

    protected onMount() { /* abstract */
    }

    protected onUnmount() { /* abstract */
    }

    protected onBeforeRender() { /* abstract */
    }

    protected onAfterRender() { /* abstract */
    }

    protected onBeforeUpdate() { /* abstract */
    }

    protected onAfterUpdate() { /* abstract */
    }

    protected onAfterChildrenRendered() { /* abstract */
    }

    public update(state: object) {
        // update only if necessary
        if (JSON.stringify(state) !== JSON.stringify(this.state)) {
            this.markDirty();
        }

        this.setState(state);

        enqueueRender(this);
    }

    public updateStateProperties(properties: object) {
        let state = { ...this.state, ...properties };

        this.update(state);
    }

    protected getState() {
        return { ...{}, ...this.state };
    }

    /**
     * Sets component state and props
     * state is cloned (NOT DEEP CLONE)
     * @param {Object} state
     */
    protected setState(state: object) {
        this.onBeforeUpdate();
        this.state = { ...{}, ...state };
        this.onAfterUpdate();
    }

    show(): void {
        this.getElement().style.display = "block";
    }

    hide(): void {
        this.getElement().style.display = "none";
    }

    isShown(): boolean {
        return this.getElement().style.display == "block";
    }

    addClassName(className: string): void {
        if (this.hasClassName(className)) {
            return;
        }

        this.getElement().className += ' ' + className;
    }

    removeClassName(className: string): void {
        let $el = this.getElement();
        $el.className = $el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    hasClassName(className: string): boolean {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.getElement().className);
    }

    public getRoute(): string {
        return location.hash.replace('#/', '');
    }

    public getRenderedChildren() {
        return {};
    }

    public getRenderedContent() {
        const template = this.getTemplate();

        this.markDirty(false);
        if (template) {
            var partials;
            var state = { ...this.state, ...this.getRenderedChildren() }
            return '<div id="' + this.getId() + '">' + render(template, state, partials) + '</div>';
        }
    }

    private _render() {
        this.markDirty(false);

        const template = this.getTemplate();

        if (template) {
            const rendered = this.getRenderedContent();

            let element = document.getElementById(this.getId());
            if (element) {
                if (element.innerHTML !== rendered) {
                    element.innerHTML = rendered;
                }
            }
        }
    }
}

import { ComponentInterface } from "./Component";
//import { Logger } from "./Shared/common/Logger";

export class DOM {
    static customElements: { [index: string]: () => ComponentInterface } = {};

    /**
     * Defines custom Component
     * @param {string} tagName
     * @param clazz
     */
    static define(tagName: string, clazz: any) {
        clazz.tag(tagName);
        DOM.customElements[tagName] = clazz;
    }

    static getDefinedTags(): string[] {
        let tags = [];
        for (let name in DOM.customElements) {
            tags.push(name);
        }

        return tags;
    }

    /**
     * Gets tag class constructor
     * @param {string} tagName
     * @return {ComponentInterface}
     */
    static getTagObject(tagName: string): () => ComponentInterface {
        if (!DOM.customElements) {
            return undefined;
        }

        return DOM.customElements[tagName];
    }

    ///**
    // *
    // * @param clazz
    // * @return {string|null}
    // */
    //static getTagName(clazz: ComponentInterface) {
    //    let name = clazz.constructor.name;
    //    for (let tagName in DOM.customElements) {
    //        if (name === DOM.getTagObject(tagName).name) {
    //            return tagName;
    //        }
    //    }

    //    return null;
    //}

    /**
     * Init DOM
     * Hydrates components HTML
     * @param {ComponentInterface} root
     * @param {HTMLElement} $subTree
     */

    public static mount(root: ComponentInterface, $subTree?: HTMLElement) {
        let $rootElement = $subTree || root.getElement();
        let id = $rootElement.id;

        // escape periods in ID
        let idParts = id.split(".");

        if (idParts.length > 1) {
            id = idParts.join("\\.");
        }

        let selectors = [];
        for (let name in DOM.customElements) {
            selectors.push("#" + id + " " + name);
        }

        // add data-is attribute
        selectors.push("#" + id + " " + '[data-is]');

        let selector = selectors.join(', ');

        //Logger.debug('initializing DOM inside #', root.getId());

        let $elements = $rootElement.getElementsByTagName("div");
        root.deleteAllChildren(); //Todo Store children
        for (let j = 0, count = $elements.length; j < count; j++) {
            let $e = $elements[j];

            if (($e instanceof HTMLElement)) {
                DOM.mountElement(root, $e);
            }
        }
    }

    /**
     * Hydrate HTML element
     * @param {ComponentInterface} parent
     * @param {HTMLElement} $element
     * @return {ComponentInterface|void}
     */
    private static mountElement(parent: ComponentInterface, $element: any): ComponentInterface {
        const hydratedAttrName = "data-myqhydrated";

        if ($element.hasAttribute(hydratedAttrName)) {
            return;
        }
        /*else if (!($element instanceof HTMLElement)) {
            return;
        }*/

        //Logger.debug('Hydrating', $element);

        let className = DOM.getClassName($element);

        if (!className) {
            return null;
        }

        let c = DOM.getComponentClass(className);

        if (c === undefined) {
            $element.setAttribute(hydratedAttrName, "");
            return null;
        }

        const component = new c();
        component.mount($element);
        parent.addChild(component);
        return component;
    }

    public static getState(element: HTMLElement) {
        let state = element.getAttribute('data-state') || null;
        if (state) {
            state = state.replace("\\\'", "\'");
        }

        return JSON.parse(state);
    }

    private static getClassName(element: HTMLElement) {
        let className = element.localName.toLowerCase();
        let constructor = DOM.getTagObject(className);

        if (constructor !== undefined) {
            return className;
        }

        return element.getAttribute('data-is');
    }

    public static getComponentClass(className: string): any {
        return DOM.getTagObject(className);
    }
}

import { Logger } from "./Logger";
import { ComponentInterface } from "./Component";

export class EventsListener implements EventListenerObject {
    events: { [index: string]: any } = {};
    private readonly listener: any | ComponentInterface;

    constructor(listener: ComponentInterface) {
        this.listener = listener;
    }

    addEventListener(event: string, listener?: any) {
        const $e = <HTMLElement>this.listener.getElement();

        listener = this.resolveListener(listener, event);

        if (!listener) {
            throw new Error("Invalid event listener " + listener.toString());
        }

        this.events[event] = listener;
        Logger.debug('listening', "#" + $e.id, event);

        return $e.addEventListener(event, this, false);
    }

    removeEventListener(event?: string) {
        const $e = <HTMLElement>this.listener.getElement();
        const listener = this.events[event];

        if (!listener) {
            return;
        }

        delete this.events[event];

        return $e.removeEventListener(event, this.resolveListener(listener, event));
    }

    remove(): void {
        //TODO remove all listeners
    }

    handleEvent(e: Event) {
        let eventType: string = e.type;
        let listener = this.events[eventType];

        if (listener === undefined) {
            return;
        }

        if (e instanceof MutationEvent) {
            //console.debug(eventType, e.relatedNode, this.listener.getElement());

            if (e.relatedNode !== this.listener.getElement()) {
                return;
            }
        }

        this.callListener(eventType, e);
    }

    private resolveListener(listener: any, event: string) {
        if (typeof listener === 'function') {
            return listener;
        } else if (typeof listener === 'string' && typeof this.listener[listener] === 'function') {
            return listener;
            //} else if (typeof this.listener['on' + event.ucFirst()] === 'function') {
            //    return 'on' + event.ucFirst();
        } else if (typeof this.listener['on' + event.toLowerCase()] === 'function') {
            return 'on' + event.toLowerCase();
        } else if (typeof this.listener['on' + event] === 'function') {
            return 'on' + event;
        }

        return undefined;
    }

    private callListener(eventType: string, event: Event) {
        let listener = this.events[eventType];

        if (typeof listener === 'function') {
            listener(event);
        } else {
            this.listener[listener](event);
        }
    }
}

import { Component, ComponentOptions } from "./Component";

export interface HeaderComponentProps extends ComponentOptions {
    title: string
}

export class HeaderComponent extends Component {
    protected props: HeaderComponentProps;

    constructor(opts: HeaderComponentProps) {
        super(opts);
    }

    public getTemplate(): string {
        return `<div style="border: 1px solid black">{{title}}</div>`;
    }
}

import { Component, ComponentOptions } from "./Component";

export interface ItemComponentProps extends ComponentOptions {
}

export class ItemComponent extends Component {
    protected props: ItemComponentProps;

    //constructor(opts: ItemComponentProps) {
    //    super(opts);
    //}
}

import { Component, ComponentOptions } from "./Component";
import { TextItemComponent } from "./TextItemComponent";

export interface ListComponentProps extends ComponentOptions {
    items: []
}

export class ListComponent extends Component {
    protected props: ListComponentProps;

    items: Component[]

    constructor(opts: ListComponentProps) {
        super(opts);
        this.items = opts.items.map((item) => new TextItemComponent(item));
    }

    //public getRenderedChildren() {
    //    return {
    //        itemComponents:
    //            this.items.map((item)=> item.)
    //    }
    //}

    public getTemplate(): string {
        return `{{#itemComponents}}
                * {{getRenderedContent}}
                {{/items}}`;
    }
}

export class Logger {
    static isEnabled: boolean = false;

    static enable(enable: boolean) {
        Logger.isEnabled = enable;
    }

    static debug(msg: string, ...optionalParams: any[]) {
        Logger.log(msg, 'debug', ...optionalParams);
    }

    static info(msg: string, ...optionalParams: any[]) {
        Logger.log(msg, 'info', ...optionalParams);
    }

    static warn(msg: string, ...optionalParams: any[]) {
        Logger.log(msg, 'warn', ...optionalParams);
    }

    static error(msg: string, ...optionalParams: any[]) {
        Logger.log(msg, 'error', ...optionalParams);
    }

    static log(msg: any, type: string, ...optionalParams: any[]) {
        if (!Logger.isEnabled) {
            return;
        }

        switch (type) {
            case 'debug':
                console.debug(msg, ...optionalParams);
                break;
            case 'info':
                console.info(msg, ...optionalParams);
                break;
            case 'warn':
                console.warn(msg, ...optionalParams);
                break;
            case 'error':
                console.error(msg, ...optionalParams);
                break;
            default:
                console.log(msg, ...optionalParams);
        }
    }

    private static stringifyParam(param: any): string {
        let text: string;

        alert("2");
        if (param instanceof HTMLElement) {
            let tagName = param.localName.toLowerCase();
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
    }
}

import { Component, ComponentOptions } from "./Component";
import { HeaderComponent, HeaderComponentProps } from "./HeaderComponent";
import { ListComponent, ListComponentProps } from "./ListComponent";

export interface PageComponentProps extends ComponentOptions {
    header: HeaderComponentProps
    list: ListComponentProps
}

export class PageComponent extends Component {
    protected props: HeaderComponentProps;

    header: HeaderComponent
    list: ListComponent

    constructor(opts: PageComponentProps) {
        super(opts);
        this.header = new HeaderComponent(opts.header);
        this.list = new ListComponent(opts.list);
    }

    public getRenderedChildren() {
        return {
            header: this.header.getRenderedContent(),
            list: this.list.getRenderedContent()
        }
    }

    public getTemplate(): string {
        return `<div>{{header}}</div>
                <div>{{list}}</div>`;
    }
}

import { ComponentInterface } from "./Component";

let items: ComponentInterface[] = [];

export function clearRender() {
    items = [];
}

export function enqueueRender(component: ComponentInterface) {
    if (component.isDirty() && items.push(component) == 1) {
        window.setTimeout(rerender, 0);
    }
}

export function rerender() {
    let component, list = items;
    items = [];

    for (let i in list) {
        component = list[i];
        if (component.isDirty() && !component.getParent().isDirty()) {
            component.render();
        }
    }
}

import { DOM } from "./DOM";
import { Component, ComponentOptions } from "./Component";
import { Logger } from "./Logger";
import { PageComponentProps } from "./PageComponent";
//import { MessageDialogComponent, MessageDialogProps } from "./components/messagedialog/MessageDialogComponent";

//DOM.define("message-dialog", MessageDialogComponent);

export interface RootComponentProps extends ComponentOptions {
    page: PageComponentProps
}

export class RootComponent extends Component {
    static root: RootComponent;

    constructor(opts: ComponentOptions = {}) {
        //RootComponent.root = this;

        super(opts);
    }
}

import { ItemComponent, ItemComponentProps } from "./ItemComponent";

export interface TextItemComponentProps extends ItemComponentProps {
    description: string,
    value: string
}

export class TextItemComponent extends ItemComponent {
    protected props: TextItemComponentProps;

    constructor(opts: TextItemComponentProps) {
        super(opts);
        this.props = opts;
    }

    public getTemplate(): string {
        return `<span style="font-weight:bold">{{description}}:</span>
                <span>{{value}}</span>`;
    }
}

{"version":3,"file":"App.js","sourceRoot":"","sources":["App.ts"],"names":[],"mappings":";;;IAEA,MAAM,CAAC,gBAAgB,CAAC,MAAM,EAAE,UAAC,KAAK;QAClC,IAAI,WAAW,GAAG,QAAQ,CAAC,cAAc,CAAC,KAAK,CAAC,CAAC;QACjD,WAAW,CAAC,SAAS,GAAG,kDAAkD,CAAC;QAC3E,IAAI,YAAY,GAAG,QAAQ,CAAC,cAAc,CAAC,OAAO,CAAC,CAAC;QACpD,YAAY,CAAC,SAAS,GAAG,KAAK,CAAC;QAC/B,WAAW,CAAC,SAAS,GAAG,wDAAwD,CAAC;QACjF,YAAY,CAAC,SAAS,GAAG,KAAK,CAAC;QAE/B,IAAI,aAAa,GAAG,IAAI,6BAAa,EAAE,CAAC;QACxC,IAAI,WAAW,GAAG,QAAQ,CAAC,cAAc,CAAC,KAAK,CAAC,CAAC;QACjD,aAAa,CAAC,UAAU,CAAC,WAAW,CAAC,CAAC;QACtC,aAAa,CAAC,MAAM,EAAE,CAAC;IAC3B,CAAC,CAAC,CAAC"}
{"version":3,"file":"BroadcastData.js","sourceRoot":"","sources":["BroadcastData.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;IAAA;QAII,uBAAY,MAAW,EAAE,OAAc;YAFvC,YAAO,GAAQ,EAAE,CAAC;YAGd,IAAI,CAAC,MAAM,GAAG,MAAM,CAAC;YAErB,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,OAAO,CAAC,MAAM,EAAE,CAAC,GAAG,CAAC,EAAE,CAAC,EAAE,EAAE;gBAC5C,IAAI,MAAM,GAAG,OAAO,CAAC,CAAC,CAAC,CAAC;gBACxB,IAAI,OAAO,MAAM,KAAK,QAAQ,EAAE;oBAC5B,IAAI,CAAC,OAAO,CAAC,MAAM,CAAC,GAAG,IAAI,CAAC;iBAC/B;qBAAM;oBACH,IAAI,CAAC,OAAO,yBAAQ,IAAI,CAAC,OAAO,GAAK,MAAM,CAAE,CAAC;iBACjD;aACJ;QACL,CAAC;QAED,iCAAS,GAAT;YAAU,iBAAoB;iBAApB,UAAoB,EAApB,qBAAoB,EAApB,IAAoB;gBAApB,4BAAoB;;YAC1B,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,OAAO,CAAC,MAAM,EAAE,CAAC,GAAG,CAAC,EAAE,CAAC,EAAE,EAAE;gBAC5C,IAAI,CAAC,GAAW,OAAO,CAAC,CAAC,CAAC,CAAC;gBAC3B,IAAI,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,KAAK,SAAS,EAAE;oBAC/B,OAAO,IAAI,CAAC;iBACf;aACJ;YAED,OAAO,KAAK,CAAC;QACjB,CAAC;QAED,iCAAS,GAAT,UAAU,MAAW;YACjB,OAAO,CAAC,IAAI,CAAC,OAAO,CAAC,MAAM,CAAC,KAAK,SAAS,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC;QAC9E,CAAC;QACL,oBAAC;IAAD,CAAC,AA/BD,IA+BC;IA/BY,sCAAa"}
{"version":3,"file":"Component.js","sourceRoot":"","sources":["Component.ts"],"names":[],"mappings":"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"}
{"version":3,"file":"DOM.js","sourceRoot":"","sources":["DOM.ts"],"names":[],"mappings":"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"}
{"version":3,"file":"EventsListener.js","sourceRoot":"","sources":["EventsListener.ts"],"names":[],"mappings":"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"}
{"version":3,"file":"HeaderComponent.js","sourceRoot":"","sources":["HeaderComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;IAMA;QAAqC,mCAAS;QAG1C,yBAAY,IAA0B;mBAClC,kBAAM,IAAI,CAAC;QACf,CAAC;QAEM,qCAAW,GAAlB;YACI,OAAO,wDAAsD,CAAC;QAClE,CAAC;QACL,sBAAC;IAAD,CAAC,AAVD,CAAqC,qBAAS,GAU7C;IAVY,0CAAe"}
{"version":3,"file":"ItemComponent.js","sourceRoot":"","sources":["ItemComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;IAKA;QAAmC,iCAAS;QAA5C;;QAMA,CAAC;QAAD,oBAAC;IAAD,CAAC,AAND,CAAmC,qBAAS,GAM3C;IANY,sCAAa"}
{"version":3,"file":"ListComponent.js","sourceRoot":"","sources":["ListComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;IAOA;QAAmC,iCAAS;QAKxC,uBAAY,IAAwB;YAApC,YACI,kBAAM,IAAI,CAAC,SAEd;YADG,KAAI,CAAC,KAAK,GAAG,IAAI,CAAC,KAAK,CAAC,GAAG,CAAC,UAAC,IAAI,IAAK,OAAA,IAAI,qCAAiB,CAAC,IAAI,CAAC,EAA3B,CAA2B,CAAC,CAAC;;QACvE,CAAC;QASM,mCAAW,GAAlB;YACI,OAAO,2FAEY,CAAC;QACxB,CAAC;QACL,oBAAC;IAAD,CAAC,AAtBD,CAAmC,qBAAS,GAsB3C;IAtBY,sCAAa"}
{"version":3,"file":"Logger.js","sourceRoot":"","sources":["Logger.ts"],"names":[],"mappings":"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"}
{"version":3,"file":"PageComponent.js","sourceRoot":"","sources":["PageComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;IASA;QAAmC,iCAAS;QAMxC,uBAAY,IAAwB;YAApC,YACI,kBAAM,IAAI,CAAC,SAGd;YAFG,KAAI,CAAC,MAAM,GAAG,IAAI,iCAAe,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;YAC/C,KAAI,CAAC,IAAI,GAAG,IAAI,6BAAa,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;;QAC7C,CAAC;QAEM,2CAAmB,GAA1B;YACI,OAAO;gBACH,MAAM,EAAE,IAAI,CAAC,MAAM,CAAC,kBAAkB,EAAE;gBACxC,IAAI,EAAE,IAAI,CAAC,IAAI,CAAC,kBAAkB,EAAE;aACvC,CAAA;QACL,CAAC;QAEM,mCAAW,GAAlB;YACI,OAAO,4DACqB,CAAC;QACjC,CAAC;QACL,oBAAC;IAAD,CAAC,AAvBD,CAAmC,qBAAS,GAuB3C;IAvBY,sCAAa"}
{"version":3,"file":"RenderQueue.js","sourceRoot":"","sources":["RenderQueue.ts"],"names":[],"mappings":";;;;IAEA,IAAI,KAAK,GAAyB,EAAE,CAAC;IAErC,SAAgB,WAAW;QACvB,KAAK,GAAG,EAAE,CAAC;IACf,CAAC;IAFD,kCAEC;IAED,SAAgB,aAAa,CAAC,SAA6B;QACvD,IAAI,SAAS,CAAC,OAAO,EAAE,IAAI,KAAK,CAAC,IAAI,CAAC,SAAS,CAAC,IAAI,CAAC,EAAE;YACnD,MAAM,CAAC,UAAU,CAAC,QAAQ,EAAE,CAAC,CAAC,CAAC;SAClC;IACL,CAAC;IAJD,sCAIC;IAED,SAAgB,QAAQ;QACpB,IAAI,SAAS,EAAE,IAAI,GAAG,KAAK,CAAC;QAC5B,KAAK,GAAG,EAAE,CAAC;QAEX,KAAK,IAAI,CAAC,IAAI,IAAI,EAAE;YAChB,SAAS,GAAG,IAAI,CAAC,CAAC,CAAC,CAAC;YACpB,IAAI,SAAS,CAAC,OAAO,EAAE,IAAI,CAAC,SAAS,CAAC,SAAS,EAAE,CAAC,OAAO,EAAE,EAAE;gBACzD,SAAS,CAAC,MAAM,EAAE,CAAC;aACtB;SACJ;IACL,CAAC;IAVD,4BAUC"}
{"version":3,"file":"RootComponent.js","sourceRoot":"","sources":["RootComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;IAYA;QAAmC,iCAAS;QAGxC,uBAAY,IAA2B;YAA3B,qBAAA,EAAA,SAA2B;mBAGnC,kBAAM,IAAI,CAAC;QACf,CAAC;QACL,oBAAC;IAAD,CAAC,AARD,CAAmC,qBAAS,GAQ3C;IARY,sCAAa"}
{"version":3,"file":"TextItemComponent.js","sourceRoot":"","sources":["TextItemComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;IAOA;QAAuC,qCAAa;QAGhD,2BAAY,IAA4B;YAAxC,YACI,kBAAM,IAAI,CAAC,SAEd;YADG,KAAI,CAAC,KAAK,GAAG,IAAI,CAAC;;QACtB,CAAC;QAEM,uCAAW,GAAlB;YACI,OAAO,kGACwB,CAAC;QACpC,CAAC;QACL,wBAAC;IAAD,CAAC,AAZD,CAAuC,6BAAa,GAYnD;IAZY,8CAAiB"}