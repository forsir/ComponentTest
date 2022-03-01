import { InternalEvent } from "./Common/InternalEvent";
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

        InternalEvent.Register("header-click", () => this.clicked())

        this.updateStateProperties({ showList: true });
    }

    public clicked() {
        this.updateStateProperties({ showList: !this.state.showList });
    }

    public getTemplate(): string {
        if (this.state.showList) {
            return `<div>{{>header}}</div>
                <div>{{>list}}</div>`;
        } else {
            return `<div>{{>header}}</div>`;
        }
    }
}
