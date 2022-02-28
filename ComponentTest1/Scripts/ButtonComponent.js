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
exports.ButtonComponent = void 0;
var Component_1 = require("./Component");
var ButtonComponent = (function (_super) {
    __extends(ButtonComponent, _super);
    function ButtonComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonComponent.prototype.onCreated = function () {
        _super.prototype.onCreated.call(this);
    };
    ButtonComponent.prototype.onMount = function () {
        _super.prototype.onMount.call(this);
        this.on("click", 'invokeAction');
    };
    ButtonComponent.prototype.onAfterUpdate = function () {
        _super.prototype.onAfterUpdate.call(this);
        if (!this.props.disabled) {
            this.props.disabled = false;
        }
        if (!this.props.hidden) {
            this.props.hidden = false;
        }
    };
    ButtonComponent.prototype.onAfterRender = function () {
        _super.prototype.onAfterRender.call(this);
        this.addClassName("btn");
        if (this.props.disabled) {
            this.addClassName("disabled");
        }
        else {
            this.removeClassName("disabled");
        }
        if (this.props.hidden) {
            this.addClassName("hidden");
        }
        else {
            this.removeClassName("hidden");
        }
    };
    ButtonComponent.prototype.invokeAction = function () {
        if (!this.props.disabled) {
            this.onClick();
        }
    };
    ButtonComponent.prototype.onClick = function () {
        this.broadcast(this.props.command);
    };
    return ButtonComponent;
}(Component_1.Component));
exports.ButtonComponent = ButtonComponent;
//# sourceMappingURL=ButtonComponent.js.map