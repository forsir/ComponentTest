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
        parent.addChild($element.id, component);
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