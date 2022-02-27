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