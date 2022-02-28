import W from "../Common/Dictionary";
import { MessageDialogButtonProps } from "./MessageDialogButtonComponent";
import { MessageDialogComponent, MessageDialogProps } from "./MessageDialogComponent";

export class MessageDialog {
    private static messageDialogComponent: MessageDialogComponent;

    private static GetMessageDialogComponent() {
        MessageDialog.messageDialogComponent = new MessageDialogComponent({ state: {} });
        return MessageDialog.messageDialogComponent;
    }

    public static showOkDialogMessage(type: MessageDialogType, text: string) {
        MessageDialog.showDialogMessage(type, text, [{ text: W("BTN_OK") }]);
    }

    public static showOkWithActionDialogMessage(type: MessageDialogType, text: string, action: () => void) {
        MessageDialog.showDialogMessage(type, text, [{ text: W("BTN_OK"), action: action }]);
    }

    public static showConfirmDialogMessage(type: MessageDialogType, text: string, action: () => void) {
        MessageDialog.showDialogMessage(type, text,
            [{ text: W("BTN_OK"), action: action }, { text: W("BTN_CANCEL") }]);
    }

    public static showConfirmYesOrNoDialogMessage(type: MessageDialogType, text: string, action: () => void) {
        MessageDialog.showDialogMessage(type, text,
            [{ text: W("BTN_YES"), action: action }, { text: W("BTN_NO") }]);
    }

    public static showDialogMessage(type: MessageDialogType, text: string, buttons: MessageDialogButtonProps[]) {
        this.messageDialogComponent?.update(<MessageDialogProps>{
            type: type,
            text: text,
            buttons: buttons,
            getText: function (): string {
                return (<MessageDialogProps>this).text;
            }
        });

        window.setTimeout(() => {
            document.getElementById("mq-dialog").style.display = "block";
        }, 10);
    }

    public static hideDialogMessage() {
        document.getElementById("mq-dialog").style.display = "none";
    }

    public updateDialog(dialog: MessageDialogProps) {
        MessageDialog.GetMessageDialogComponent()?.update(dialog);
    }
}