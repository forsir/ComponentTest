import { Component, ComponentOptions } from "./Component";

export interface HeaderComponentProps extends ComponentOptions {
    title: string
}

export class HeaderComponent extends Component {
    protected props: HeaderComponentProps;

    constructor(opts: HeaderComponentProps) {
        super(opts);
    }

    public getTemplate(): string {
        return `<div style="border: 1px solid black">{{title}}</div>`;
    }
}
