import { InternalEvent } from "./Common/InternalEvent";
import { Component, ComponentProps } from "./Component";

export interface HeaderComponentProps extends ComponentProps {
    title: string
}

export class HeaderComponent extends Component {
    constructor(opts: HeaderComponentProps) {
        super(opts);

        this.updateStateProperties({ count: 0 });
        InternalEvent.Register("checkbox-click", () => this.clicked())
    }

    public clicked() {
        console.log("header clicked");
        this.updateStateProperties({ count: this.state.count + 1 });
    }

    public getTemplate(): string {
        return `<div style="border: 1px solid black">{{title}} {{count}}</div>`;
    }
}
