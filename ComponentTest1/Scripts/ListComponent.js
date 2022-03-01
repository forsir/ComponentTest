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
var CheckBoxItemComponent_1 = require("./CheckBoxItemComponent");
var Component_1 = require("./Component");
var DatasetItemComponent_1 = require("./DatasetItemComponent");
var ItemComponent_1 = require("./ItemComponent");
var TextItemComponent_1 = require("./TextItemComponent");
var ListComponent = (function (_super) {
    __extends(ListComponent, _super);
    function ListComponent(props) {
        var _this = _super.call(this, props) || this;
        for (var i = 0; i < props.items.length; i++) {
            _this.addChild(null, _this.createChildren(props.items[i]));
        }
        return _this;
    }
    ListComponent.prototype.createChildren = function (props) {
        if (props.type == 1) {
            return new TextItemComponent_1.TextItemComponent(props);
        }
        if (props.type == 2) {
            return new CheckBoxItemComponent_1.CheckBoxItemComponent(props);
        }
        if (props.type == 3) {
            return new DatasetItemComponent_1.DatasetItemComponent(props);
        }
        return new ItemComponent_1.ItemComponent(props);
    };
    ListComponent.prototype.getRenderedChildren = function () {
        return {
            children: this.getChildren().map(function (c) { return c.getRenderedContent(); })
        };
    };
    ListComponent.prototype.getTemplate = function () {
        return "{{#children}}\n                {{{.}}}\n                {{/children}}";
    };
    return ListComponent;
}(Component_1.Component));
exports.ListComponent = ListComponent;
//# sourceMappingURL=ListComponent.js.map