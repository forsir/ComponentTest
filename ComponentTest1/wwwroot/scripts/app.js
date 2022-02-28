"use strict";
exports.__esModule = true;
var RootComponent_1 = require("./RootComponent");
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
//# sourceMappingURL=App.js.map
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
exports.Component = exports.EvtSource = void 0;
var EventsListener_1 = require("./EventsListener");
var BroadcastData_1 = require("./BroadcastData");
var RenderQueue_1 = require("./RenderQueue");
var mustache_1 = require("mustache");
var RootComponent_1 = require("./RootComponent");
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
//# sourceMappingURL=Component.js.map
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
//# sourceMappingURL=DOM.js.map
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
//# sourceMappingURL=EventsListener.js.map
"use strict";
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
exports.__esModule = true;
exports.HeaderComponent = void 0;
var Component_1 = require("./Component");
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
//# sourceMappingURL=HeaderComponent.js.map
"use strict";
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
exports.__esModule = true;
exports.ItemComponent = void 0;
var Component_1 = require("./Component");
var ItemComponent = (function (_super) {
    __extends(ItemComponent, _super);
    function ItemComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ItemComponent;
}(Component_1.Component));
exports.ItemComponent = ItemComponent;
//# sourceMappingURL=ItemComponent.js.map
"use strict";
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
exports.__esModule = true;
exports.ListComponent = void 0;
var Component_1 = require("./Component");
var TextItemComponent_1 = require("./TextItemComponent");
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
//# sourceMappingURL=ListComponent.js.map
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
"use strict";
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
exports.__esModule = true;
exports.PageComponent = void 0;
var Component_1 = require("./Component");
var HeaderComponent_1 = require("./HeaderComponent");
var ListComponent_1 = require("./ListComponent");
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
//# sourceMappingURL=PageComponent.js.map
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
//# sourceMappingURL=RenderQueue.js.map
"use strict";
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
exports.__esModule = true;
exports.RootComponent = void 0;
var Component_1 = require("./Component");
var RootComponent = (function (_super) {
    __extends(RootComponent, _super);
    function RootComponent(opts) {
        if (opts === void 0) { opts = {}; }
        return _super.call(this, opts) || this;
    }
    return RootComponent;
}(Component_1.Component));
exports.RootComponent = RootComponent;
//# sourceMappingURL=RootComponent.js.map
"use strict";
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
exports.__esModule = true;
exports.TextItemComponent = void 0;
var ItemComponent_1 = require("./ItemComponent");
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

{"version":3,"file":"App.js","sourceRoot":"","sources":["../App.ts"],"names":[],"mappings":";;AAAA,iDAAgD;AAEhD,MAAM,CAAC,gBAAgB,CAAC,MAAM,EAAE,UAAC,KAAK;IAClC,IAAI,WAAW,GAAG,QAAQ,CAAC,cAAc,CAAC,KAAK,CAAC,CAAC;IACjD,WAAW,CAAC,SAAS,GAAG,kDAAkD,CAAC;IAC3E,IAAI,YAAY,GAAG,QAAQ,CAAC,cAAc,CAAC,OAAO,CAAC,CAAC;IACpD,YAAY,CAAC,SAAS,GAAG,KAAK,CAAC;IAC/B,WAAW,CAAC,SAAS,GAAG,wDAAwD,CAAC;IACjF,YAAY,CAAC,SAAS,GAAG,KAAK,CAAC;IAE/B,IAAI,aAAa,GAAG,IAAI,6BAAa,EAAE,CAAC;IACxC,IAAI,WAAW,GAAG,QAAQ,CAAC,cAAc,CAAC,KAAK,CAAC,CAAC;IACjD,aAAa,CAAC,UAAU,CAAC,WAAW,CAAC,CAAC;IACtC,aAAa,CAAC,MAAM,EAAE,CAAC;AAC3B,CAAC,CAAC,CAAC"}
{"version":3,"file":"BroadcastData.js","sourceRoot":"","sources":["../BroadcastData.ts"],"names":[],"mappings":";;;;;;;;;;;;;;AAAA;IAII,uBAAY,MAAW,EAAE,OAAc;QAFvC,YAAO,GAAQ,EAAE,CAAC;QAGd,IAAI,CAAC,MAAM,GAAG,MAAM,CAAC;QAErB,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,OAAO,CAAC,MAAM,EAAE,CAAC,GAAG,CAAC,EAAE,CAAC,EAAE,EAAE;YAC5C,IAAI,MAAM,GAAG,OAAO,CAAC,CAAC,CAAC,CAAC;YACxB,IAAI,OAAO,MAAM,KAAK,QAAQ,EAAE;gBAC5B,IAAI,CAAC,OAAO,CAAC,MAAM,CAAC,GAAG,IAAI,CAAC;aAC/B;iBAAM;gBACH,IAAI,CAAC,OAAO,yBAAQ,IAAI,CAAC,OAAO,GAAK,MAAM,CAAE,CAAC;aACjD;SACJ;IACL,CAAC;IAED,iCAAS,GAAT;QAAU,iBAAoB;aAApB,UAAoB,EAApB,qBAAoB,EAApB,IAAoB;YAApB,4BAAoB;;QAC1B,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,OAAO,CAAC,MAAM,EAAE,CAAC,GAAG,CAAC,EAAE,CAAC,EAAE,EAAE;YAC5C,IAAI,CAAC,GAAW,OAAO,CAAC,CAAC,CAAC,CAAC;YAC3B,IAAI,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,KAAK,SAAS,EAAE;gBAC/B,OAAO,IAAI,CAAC;aACf;SACJ;QAED,OAAO,KAAK,CAAC;IACjB,CAAC;IAED,iCAAS,GAAT,UAAU,MAAW;QACjB,OAAO,CAAC,IAAI,CAAC,OAAO,CAAC,MAAM,CAAC,KAAK,SAAS,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC;IAC9E,CAAC;IACL,oBAAC;AAAD,CAAC,AA/BD,IA+BC;AA/BY,sCAAa"}
{"version":3,"file":"Component.js","sourceRoot":"","sources":["../Component.ts"],"names":[],"mappings":"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"}
{"version":3,"file":"DOM.js","sourceRoot":"","sources":["../DOM.ts"],"names":[],"mappings":"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"}
{"version":3,"file":"EventsListener.js","sourceRoot":"","sources":["../EventsListener.ts"],"names":[],"mappings":"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"}
{"version":3,"file":"HeaderComponent.js","sourceRoot":"","sources":["../HeaderComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;AAAA,yCAA0D;AAM1D;IAAqC,mCAAS;IAG1C,yBAAY,IAA0B;eAClC,kBAAM,IAAI,CAAC;IACf,CAAC;IAEM,qCAAW,GAAlB;QACI,OAAO,wDAAsD,CAAC;IAClE,CAAC;IACL,sBAAC;AAAD,CAAC,AAVD,CAAqC,qBAAS,GAU7C;AAVY,0CAAe"}
{"version":3,"file":"ItemComponent.js","sourceRoot":"","sources":["../ItemComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;AAAA,yCAA0D;AAK1D;IAAmC,iCAAS;IAA5C;;IAMA,CAAC;IAAD,oBAAC;AAAD,CAAC,AAND,CAAmC,qBAAS,GAM3C;AANY,sCAAa"}
{"version":3,"file":"ListComponent.js","sourceRoot":"","sources":["../ListComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;AAAA,yCAA0D;AAC1D,yDAAwD;AAMxD;IAAmC,iCAAS;IAKxC,uBAAY,IAAwB;QAApC,YACI,kBAAM,IAAI,CAAC,SAEd;QADG,KAAI,CAAC,KAAK,GAAG,IAAI,CAAC,KAAK,CAAC,GAAG,CAAC,UAAC,IAAI,IAAK,OAAA,IAAI,qCAAiB,CAAC,IAAI,CAAC,EAA3B,CAA2B,CAAC,CAAC;;IACvE,CAAC;IASM,mCAAW,GAAlB;QACI,OAAO,2FAEY,CAAC;IACxB,CAAC;IACL,oBAAC;AAAD,CAAC,AAtBD,CAAmC,qBAAS,GAsB3C;AAtBY,sCAAa"}
{"version":3,"file":"Logger.js","sourceRoot":"","sources":["../Logger.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA;IAAA;IAqEA,CAAC;IAlEU,aAAM,GAAb,UAAc,MAAe;QACzB,MAAM,CAAC,SAAS,GAAG,MAAM,CAAC;IAC9B,CAAC;IAEM,YAAK,GAAZ,UAAa,GAAW;QAAE,wBAAwB;aAAxB,UAAwB,EAAxB,qBAAwB,EAAxB,IAAwB;YAAxB,uCAAwB;;QAC9C,MAAM,CAAC,GAAG,OAAV,MAAM,iBAAK,GAAG,EAAE,OAAO,GAAK,cAAc,UAAE;IAChD,CAAC;IAEM,WAAI,GAAX,UAAY,GAAW;QAAE,wBAAwB;aAAxB,UAAwB,EAAxB,qBAAwB,EAAxB,IAAwB;YAAxB,uCAAwB;;QAC7C,MAAM,CAAC,GAAG,OAAV,MAAM,iBAAK,GAAG,EAAE,MAAM,GAAK,cAAc,UAAE;IAC/C,CAAC;IAEM,WAAI,GAAX,UAAY,GAAW;QAAE,wBAAwB;aAAxB,UAAwB,EAAxB,qBAAwB,EAAxB,IAAwB;YAAxB,uCAAwB;;QAC7C,MAAM,CAAC,GAAG,OAAV,MAAM,iBAAK,GAAG,EAAE,MAAM,GAAK,cAAc,UAAE;IAC/C,CAAC;IAEM,YAAK,GAAZ,UAAa,GAAW;QAAE,wBAAwB;aAAxB,UAAwB,EAAxB,qBAAwB,EAAxB,IAAwB;YAAxB,uCAAwB;;QAC9C,MAAM,CAAC,GAAG,OAAV,MAAM,iBAAK,GAAG,EAAE,OAAO,GAAK,cAAc,UAAE;IAChD,CAAC;IAEM,UAAG,GAAV,UAAW,GAAQ,EAAE,IAAY;QAAE,wBAAwB;aAAxB,UAAwB,EAAxB,qBAAwB,EAAxB,IAAwB;YAAxB,uCAAwB;;QACvD,IAAI,CAAC,MAAM,CAAC,SAAS,EAAE;YACnB,OAAO;SACV;QAED,QAAQ,IAAI,EAAE;YACV,KAAK,OAAO;gBACR,OAAO,CAAC,KAAK,OAAb,OAAO,iBAAO,GAAG,GAAK,cAAc,UAAE;gBACtC,MAAM;YACV,KAAK,MAAM;gBACP,OAAO,CAAC,IAAI,OAAZ,OAAO,iBAAM,GAAG,GAAK,cAAc,UAAE;gBACrC,MAAM;YACV,KAAK,MAAM;gBACP,OAAO,CAAC,IAAI,OAAZ,OAAO,iBAAM,GAAG,GAAK,cAAc,UAAE;gBACrC,MAAM;YACV,KAAK,OAAO;gBACR,OAAO,CAAC,KAAK,OAAb,OAAO,iBAAO,GAAG,GAAK,cAAc,UAAE;gBACtC,MAAM;YACV;gBACI,OAAO,CAAC,GAAG,OAAX,OAAO,iBAAK,GAAG,GAAK,cAAc,UAAE;SAC3C;IACL,CAAC;IAEc,qBAAc,GAA7B,UAA8B,KAAU;QACpC,IAAI,IAAY,CAAC;QAEjB,KAAK,CAAC,GAAG,CAAC,CAAC;QACX,IAAI,KAAK,YAAY,WAAW,EAAE;YAC9B,IAAI,OAAO,GAAG,KAAK,CAAC,SAAS,CAAC,WAAW,EAAE,CAAC;YAC5C,IAAI,GAAG,OAAO,GAAG,OAAO;kBAClB,CAAC,KAAK,CAAC,EAAE,CAAC,CAAC,CAAC,QAAQ,GAAG,KAAK,CAAC,EAAE,GAAG,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC;kBAC5C,CAAC,KAAK,CAAC,YAAY,CAAC,SAAS,CAAC,CAAC,CAAC,CAAC,aAAa,GAAG,KAAK,CAAC,YAAY,CAAC,SAAS,CAAC,GAAG,IAAI,CAAC,CAAC,CAAC,EAAE,CAAC;kBAC3F,MAAM,CAAC;SAChB;aACI,IAAI,KAAK,KAAK,IAAI,EAAE;YACrB,IAAI,GAAG,MAAM,CAAC;SACjB;aACI,IAAI,KAAK,YAAY,MAAM,EAAE;YAC9B,IAAI,GAAG,KAAK,GAAG,KAAK,CAAC,QAAQ,EAAE,GAAG,MAAM,CAAC;SAC5C;aACI;YACD,IAAI,GAAG,GAAG,GAAG,KAAK,CAAC,QAAQ,EAAE,CAAC;SACjC;QAED,OAAO,KAAK,GAAG,IAAI,CAAC;IACxB,CAAC;IAnEM,gBAAS,GAAY,KAAK,CAAC;IAoEtC,aAAC;CAAA,AArED,IAqEC;AArEY,wBAAM"}
{"version":3,"file":"PageComponent.js","sourceRoot":"","sources":["../PageComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;AAAA,yCAA0D;AAC1D,qDAA0E;AAC1E,iDAAoE;AAOpE;IAAmC,iCAAS;IAMxC,uBAAY,IAAwB;QAApC,YACI,kBAAM,IAAI,CAAC,SAGd;QAFG,KAAI,CAAC,MAAM,GAAG,IAAI,iCAAe,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;QAC/C,KAAI,CAAC,IAAI,GAAG,IAAI,6BAAa,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;;IAC7C,CAAC;IAEM,2CAAmB,GAA1B;QACI,OAAO;YACH,MAAM,EAAE,IAAI,CAAC,MAAM,CAAC,kBAAkB,EAAE;YACxC,IAAI,EAAE,IAAI,CAAC,IAAI,CAAC,kBAAkB,EAAE;SACvC,CAAA;IACL,CAAC;IAEM,mCAAW,GAAlB;QACI,OAAO,4DACqB,CAAC;IACjC,CAAC;IACL,oBAAC;AAAD,CAAC,AAvBD,CAAmC,qBAAS,GAuB3C;AAvBY,sCAAa"}
{"version":3,"file":"RenderQueue.js","sourceRoot":"","sources":["../RenderQueue.ts"],"names":[],"mappings":";;;AAEA,IAAI,KAAK,GAAyB,EAAE,CAAC;AAErC,SAAgB,WAAW;IACvB,KAAK,GAAG,EAAE,CAAC;AACf,CAAC;AAFD,kCAEC;AAED,SAAgB,aAAa,CAAC,SAA6B;IACvD,IAAI,SAAS,CAAC,OAAO,EAAE,IAAI,KAAK,CAAC,IAAI,CAAC,SAAS,CAAC,IAAI,CAAC,EAAE;QACnD,MAAM,CAAC,UAAU,CAAC,QAAQ,EAAE,CAAC,CAAC,CAAC;KAClC;AACL,CAAC;AAJD,sCAIC;AAED,SAAgB,QAAQ;IACpB,IAAI,SAAS,EAAE,IAAI,GAAG,KAAK,CAAC;IAC5B,KAAK,GAAG,EAAE,CAAC;IAEX,KAAK,IAAI,CAAC,IAAI,IAAI,EAAE;QAChB,SAAS,GAAG,IAAI,CAAC,CAAC,CAAC,CAAC;QACpB,IAAI,SAAS,CAAC,OAAO,EAAE,IAAI,CAAC,SAAS,CAAC,SAAS,EAAE,CAAC,OAAO,EAAE,EAAE;YACzD,SAAS,CAAC,MAAM,EAAE,CAAC;SACtB;KACJ;AACL,CAAC;AAVD,4BAUC"}
{"version":3,"file":"RootComponent.js","sourceRoot":"","sources":["../RootComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;AACA,yCAA0D;AAW1D;IAAmC,iCAAS;IAGxC,uBAAY,IAA2B;QAA3B,qBAAA,EAAA,SAA2B;eAGnC,kBAAM,IAAI,CAAC;IACf,CAAC;IACL,oBAAC;AAAD,CAAC,AARD,CAAmC,qBAAS,GAQ3C;AARY,sCAAa"}
{"version":3,"file":"TextItemComponent.js","sourceRoot":"","sources":["../TextItemComponent.ts"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;AAAA,iDAAoE;AAOpE;IAAuC,qCAAa;IAGhD,2BAAY,IAA4B;QAAxC,YACI,kBAAM,IAAI,CAAC,SAEd;QADG,KAAI,CAAC,KAAK,GAAG,IAAI,CAAC;;IACtB,CAAC;IAEM,uCAAW,GAAlB;QACI,OAAO,kGACwB,CAAC;IACpC,CAAC;IACL,wBAAC;AAAD,CAAC,AAZD,CAAuC,6BAAa,GAYnD;AAZY,8CAAiB"}