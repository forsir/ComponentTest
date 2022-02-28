"use strict";
exports.__esModule = true;
exports.MessageDialog = void 0;
var Dictionary_1 = require("./Dictionary");
var MessageDialogComponent_1 = require("./MessageDialogComponent");
var MessageDialog = (function () {
    function MessageDialog() {
    }
    MessageDialog.GetMessageDialogComponent = function () {
        MessageDialog.messageDialogComponent = new MessageDialogComponent_1.MessageDialogComponent({ state: {} });
        return MessageDialog.messageDialogComponent;
    };
    MessageDialog.showOkDialogMessage = function (type, text) {
        MessageDialog.showDialogMessage(type, text, [{ text: (0, Dictionary_1["default"])("BTN_OK") }]);
    };
    MessageDialog.showOkWithActionDialogMessage = function (type, text, action) {
        MessageDialog.showDialogMessage(type, text, [{ text: (0, Dictionary_1["default"])("BTN_OK"), action: action }]);
    };
    MessageDialog.showConfirmDialogMessage = function (type, text, action) {
        MessageDialog.showDialogMessage(type, text, [{ text: (0, Dictionary_1["default"])("BTN_OK"), action: action }, { text: (0, Dictionary_1["default"])("BTN_CANCEL") }]);
    };
    MessageDialog.showConfirmYesOrNoDialogMessage = function (type, text, action) {
        MessageDialog.showDialogMessage(type, text, [{ text: (0, Dictionary_1["default"])("BTN_YES"), action: action }, { text: (0, Dictionary_1["default"])("BTN_NO") }]);
    };
    MessageDialog.showDialogMessage = function (type, text, buttons) {
        var _a;
        (_a = this.messageDialogComponent) === null || _a === void 0 ? void 0 : _a.update({
            type: type,
            text: text,
            buttons: buttons,
            getText: function () {
                return this.text;
            }
        });
        window.setTimeout(function () {
            document.getElementById("mq-dialog").style.display = "block";
        }, 10);
    };
    MessageDialog.hideDialogMessage = function () {
        document.getElementById("mq-dialog").style.display = "none";
    };
    MessageDialog.prototype.updateDialog = function (dialog) {
        var _a;
        (_a = MessageDialog.GetMessageDialogComponent()) === null || _a === void 0 ? void 0 : _a.update(dialog);
    };
    return MessageDialog;
}());
exports.MessageDialog = MessageDialog;
//# sourceMappingURL=MessageDialog.js.map