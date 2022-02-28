import { Component } from "./Component";

export interface ButtonProps {
    command?: any;
    disabled?: boolean;
    hidden?: boolean;
}

export class ButtonComponent extends Component {
    protected props: ButtonProps;

    protected onCreated() {
        super.onCreated();
    }

    protected onMount() {
        super.onMount();
        this.on("click", 'invokeAction');
    }

    protected onAfterUpdate() {
        super.onAfterUpdate();
        if (!this.props.disabled) {
            this.props.disabled = false;
        }

        if (!this.props.hidden) {
            this.props.hidden = false;
        }
    }

    protected onAfterRender() {
        super.onAfterRender();
        this.addClassName("btn");
        if (this.props.disabled) {
            this.addClassName("disabled");
        } else {
            this.removeClassName("disabled");
        }
        if (this.props.hidden) {
            this.addClassName("hidden");
        } else {
            this.removeClassName("hidden");
        }
    }

    private invokeAction() {
        if (!this.props.disabled) {
            this.onClick();
        }
    }

    protected onClick() {
        this.broadcast(this.props.command);
    }
}