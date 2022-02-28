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
exports.CheckBoxItemComponent = void 0;
var ItemComponent_1 = require("./ItemComponent");
var CheckBoxItemComponent = (function (_super) {
    __extends(CheckBoxItemComponent, _super);
    function CheckBoxItemComponent(opts) {
        return _super.call(this, opts) || this;
    }
    CheckBoxItemComponent.prototype.getTemplate = function () {
        return "<span style=\"font-weight:bold\">{{description}}:</span>\n                <span>{{#value}}checked{{/value}}{{^value}}not{{/value}}</span>";
    };
    return CheckBoxItemComponent;
}(ItemComponent_1.ItemComponent));
exports.CheckBoxItemComponent = CheckBoxItemComponent;
//# sourceMappingURL=CheckBoxItemComponent.js.map