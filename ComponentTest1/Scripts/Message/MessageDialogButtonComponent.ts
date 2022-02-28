import { ButtonComponent, ButtonProps } from "../ButtonComponent";

export interface MessageDialogButtonProps extends ButtonProps {
    text: string;
    action?: () => void;
    index?: number;
}

export class MessageDialogButtonComponent extends ButtonComponent {
    protected props: MessageDialogButtonProps;

    protected onClick() {
        if (this.props.action) {
            this.props.action();
        }
    }

    public getTemplate(): string {
        return `{{text}}`;
    }
}