import { Component, ComponentOptions } from "./Component";
import { HeaderComponent, HeaderComponentProps } from "./HeaderComponent";
import { ListComponent, ListComponentProps } from "./ListComponent";

export interface PageComponentProps extends ComponentOptions {
    header: HeaderComponentProps
    list: ListComponentProps
}

export class PageComponent extends Component {
    protected props: HeaderComponentProps;

    header: HeaderComponent
    list: ListComponent

    constructor(opts: PageComponentProps) {
        super(opts);
        this.header = new HeaderComponent(opts.header);
        this.list = new ListComponent(opts.list);
    }

    public getRenderedChildren() {
        return {
            header: this.header.getRenderedContent(),
            list: this.list.getRenderedContent()
        }
    }

    public getTemplate(): string {
        return `<div>{{header}}</div>
                <div>{{list}}</div>`;
    }
}
