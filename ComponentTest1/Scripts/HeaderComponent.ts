import { Component, ComponentProps } from "./Component";

export interface HeaderComponentProps extends ComponentProps {
    title: string
}

export class HeaderComponent extends Component {
    constructor(opts: HeaderComponentProps) {
        super(opts);
    }

    public getTemplate(): string {
        return `<div style="border: 1px solid black">{{title}}</div>`;
    }
}
