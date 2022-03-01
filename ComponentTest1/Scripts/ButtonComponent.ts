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
        this.on("click", 'onClick');
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

    // TODO finish it
    protected onClick() {
        if (!this.props.disabled) {
            this.broadcast(this.props.command, this.props.command);
        }
    }
}