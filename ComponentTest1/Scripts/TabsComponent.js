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
exports.TabComponent = void 0;
var Component_1 = require("./Component");
var ListComponent_1 = require("./ListComponent");
var HeaderObjectProps = (function () {
    function HeaderObjectProps() {
    }
    return HeaderObjectProps;
}());
var TabComponent = (function (_super) {
    __extends(TabComponent, _super);
    function TabComponent(props) {
        var _this = _super.call(this, props) || this;
        var idCounter = 1;
        var startId = "mq-tab" + idCounter;
        var headers = [];
        for (var i = 0; i < props.items.length; i++) {
            var id = "mq-tab" + idCounter++;
            _this.addChild(id, new ListComponent_1.ListComponent(props.items[i].list));
            headers.push({ id: id, title: props.items[i].title });
        }
        _this.updateStateProperties({ headers: headers, selectedTabId: startId });
        return _this;
    }
    TabComponent.prototype.getRenderedChildren = function () {
        var list = this.findChild(this.state.selectedTabId);
        var headers = [];
        for (var i = 0; i < this.state.headers.length; i++) {
            var header = this.state.headers[i];
            if (header.id === this.state.selectedTabId) {
                headers.push('<span><b>' + header.title + '</b></span>');
            }
            else {
                headers.push('<span>' + header.title + '</span>');
            }
        }
        return {
            headers: headers,
            list: list
        };
    };
    TabComponent.prototype.getTemplate = function () {
        return "<div>{{#headers}}\n                {{{.}}}\n                {{/headers}}</div>\n                <div>{{{list}}}</div>";
    };
    return TabComponent;
}(Component_1.Component));
exports.TabComponent = TabComponent;
//# sourceMappingURL=TabsComponent.js.map