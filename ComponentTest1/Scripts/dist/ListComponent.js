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
    function ListComponent(props) {
        var _this = _super.call(this, props) || this;
        for (var i = 0; i < props.items.length; i++) {
            _this.addChild(null, new TextItemComponent_1.TextItemComponent(props.items[i]));
        }
        return _this;
    }
    ListComponent.prototype.getRenderedChildren = function () {
        console.log({ children: this.getChildren() });
        return {
            children: this.getChildren()
        };
    };
    ListComponent.prototype.getTemplate = function () {
        return "{{#children}}\n                * {{>getRenderedContent}}\n                {{/children}}";
    };
    return ListComponent;
}(Component_1.Component));
exports.ListComponent = ListComponent;
//# sourceMappingURL=ListComponent.js.map