import { Component, ComponentProps } from "./Component";
import { HeaderComponent, HeaderComponentProps } from "./HeaderComponent";
import { ListComponent, ListComponentProps } from "./ListComponent";

export interface PageComponentProps extends ComponentProps {
    header: HeaderComponentProps
    list: ListComponentProps
}

export class PageComponent extends Component {
    protected props: HeaderComponentProps;

    constructor(opts: PageComponentProps) {
        super(opts);
        this.addChild('header', new HeaderComponent(opts.header));
        this.addChild('list', new ListComponent(opts.list));
    }

    public getTemplate(): string {
        return `<div>{{>header}}</div>
                <div>{{>list}}</div>`;
    }
}
