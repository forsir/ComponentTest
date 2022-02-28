import { Component } from "./Component";
import { MessageDialogButtonProps } from "./MessageDialogButtonComponent";

export interface MessageDialogProps {
    type: MessageDialogType;
    text: string;
    buttons?: MessageDialogButtonProps[];
    getText: () => string;
}

export class MessageDialogComponent extends Component {
    protected props: MessageDialogProps;

    protected onAfterUpdate() {
        super.onAfterUpdate();
        if (!this.props.buttons) {
            this.props.buttons = [];
            this.getElement().style.display = "none";
        }

        for (let i = 0; i < this.props.buttons.length; i++) {
            this.props.buttons[i].index = i;
        }
    }

    protected onAfterRender() {
        super.onAfterRender();
        if (!this.props.buttons) {
            this.props.buttons = [];
        }

        for (let i = 0; i < this.props.buttons.length; i++) {
            this.findChild("dialog-button-" + this.props.buttons[i].index).update(this.props.buttons[i]);
        }
    }

    public getTemplate(): string {
        return `<div class="message-background"></div>
                <div class="message-dialog {{type}}">
                    <div class="message-dialog-content">
                        <div class="message-icon">
                            <div class="icon icon-message"></div>
                        </div>
                        <div class="message-text">
                            <div class="text-wrapper">
                                <div>{{&getText}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="message-dialog-buttons">
                        {{#buttons}}
                        <div id="dialog-button-{{index}}" data-is="dialog-button"></div>
                        {{/buttons}}
                    </div>
                </div>`
    }
}