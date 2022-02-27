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