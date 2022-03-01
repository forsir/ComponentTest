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
exports.PageComponent = void 0;
var InternalEvent_1 = require("./Common/InternalEvent");
var Component_1 = require("./Component");
var HeaderComponent_1 = require("./HeaderComponent");
var ListComponent_1 = require("./ListComponent");
var PageComponent = (function (_super) {
    __extends(PageComponent, _super);
    function PageComponent(opts) {
        var _this = _super.call(this, opts) || this;
        _this.addChild('header', new HeaderComponent_1.HeaderComponent(opts.header));
        _this.addChild('list', new ListComponent_1.ListComponent(opts.list));
        InternalEvent_1.InternalEvent.Register("header-click", function () { return _this.clicked(); });
        _this.updateStateProperties({ showList: true });
        return _this;
    }
    PageComponent.prototype.clicked = function () {
        this.updateStateProperties({ showList: !this.state.showList });
    };
    PageComponent.prototype.getTemplate = function () {
        if (this.state.showList) {
            return "<div>{{>header}}</div>\n                <div>{{>list}}</div>";
        }
        else {
            return "<div>{{>header}}</div>";
        }
    };
    return PageComponent;
}(Component_1.Component));
exports.PageComponent = PageComponent;
//# sourceMappingURL=PageComponent.js.map