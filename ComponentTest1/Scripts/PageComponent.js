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
define(["require", "exports", "./Component", "./HeaderComponent", "./ListComponent"], function (require, exports, Component_1, HeaderComponent_1, ListComponent_1) {
    "use strict";
    exports.__esModule = true;
    exports.PageComponent = void 0;
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
});
//# sourceMappingURL=PageComponent.js.map