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
exports.MessageDialogComponent = void 0;
var Component_1 = require("../Component");
var MessageDialogComponent = (function (_super) {
    __extends(MessageDialogComponent, _super);
    function MessageDialogComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MessageDialogComponent.prototype.onAfterUpdate = function () {
        _super.prototype.onAfterUpdate.call(this);
        if (!this.props.buttons) {
            this.props.buttons = [];
            this.getElement().style.display = "none";
        }
        for (var i = 0; i < this.props.buttons.length; i++) {
            this.props.buttons[i].index = i;
        }
    };
    MessageDialogComponent.prototype.onAfterRender = function () {
        _super.prototype.onAfterRender.call(this);
        if (!this.props.buttons) {
            this.props.buttons = [];
        }
        for (var i = 0; i < this.props.buttons.length; i++) {
            this.findChild("dialog-button-" + this.props.buttons[i].index).update(this.props.buttons[i]);
        }
    };
    MessageDialogComponent.prototype.getTemplate = function () {
        return "<div class=\"message-background\"></div>\n                <div class=\"message-dialog {{type}}\">\n                    <div class=\"message-dialog-content\">\n                        <div class=\"message-icon\">\n                            <div class=\"icon icon-message\"></div>\n                        </div>\n                        <div class=\"message-text\">\n                            <div class=\"text-wrapper\">\n                                <div>{{&getText}}</div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"message-dialog-buttons\">\n                        {{#buttons}}\n                        <div id=\"dialog-button-{{index}}\" data-is=\"dialog-button\"></div>\n                        {{/buttons}}\n                    </div>\n                </div>";
    };
    return MessageDialogComponent;
}(Component_1.Component));
exports.MessageDialogComponent = MessageDialogComponent;
//# sourceMappingURL=MessageDialogComponent.js.map