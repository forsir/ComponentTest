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