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
var InternalEvent_1 = require("./Common/InternalEvent");
var Component_1 = require("./Component");
var HeaderComponent = (function (_super) {
    __extends(HeaderComponent, _super);
    function HeaderComponent(opts) {
        var _this = _super.call(this, opts) || this;
        _this.updateStateProperties({ count: 0 });
        InternalEvent_1.InternalEvent.Register("checkbox-click", function () { return _this.clicked(); });
        return _this;
    }
    HeaderComponent.prototype.clicked = function () {
        console.log("header clicked");
        this.updateStateProperties({ count: this.state.count + 1 });
    };
    HeaderComponent.prototype.getTemplate = function () {
        return "<div style=\"border: 1px solid black\">{{title}} {{count}}</div>";
    };
    return HeaderComponent;
}(Component_1.Component));
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=HeaderComponent.js.map