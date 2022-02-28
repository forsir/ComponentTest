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
exports.RootComponent = void 0;
var mustache_1 = require("mustache");
var Component_1 = require("./Component");
var PageComponent_1 = require("./PageComponent");
var RootComponent = (function (_super) {
    __extends(RootComponent, _super);
    function RootComponent(props) {
        var _this = _super.call(this, props) || this;
        RootComponent.root = _this;
        _this.addChild('page', new PageComponent_1.PageComponent(props));
        return _this;
    }
    RootComponent.prototype.getTemplate = function () {
        return "{{>page}}";
    };
    RootComponent.prototype.getRenderedContent = function () {
        var template = this.getTemplate();
        this.markDirty(false);
        if (template) {
            var partials = __assign({}, this.getRenderedChildren());
            for (var key in this.children) {
                var child = this.children[key];
                partials[key] = child.getRenderedContent();
            }
            return (0, mustache_1.render)(template, this.state, partials);
        }
    };
    return RootComponent;
}(Component_1.Component));
exports.RootComponent = RootComponent;
//# sourceMappingURL=RootComponent.js.map