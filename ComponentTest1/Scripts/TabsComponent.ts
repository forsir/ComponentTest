import { Component, ComponentProps } from "./Component";
import { ListComponent, ListComponentProps } from "./ListComponent";

export interface TabComponentProps extends ComponentProps {
    items: { title: string, list: ListComponentProps }[]
}

class HeaderObjectProps {
    id: string;
    title: string;
}

export class TabComponent extends Component {
    constructor(props: TabComponentProps) {
        super(props);
        let idCounter = 1;
        let startId = "mq-tab" + idCounter;
        var headers = [];
        for (var i = 0; i < props.items.length; i++) {
            let id = "mq-tab" + idCounter++;
            this.addChild(id, new ListComponent(props.items[i].list));
            headers.push({ id: id, title: props.items[i].title });
        }
        this.updateStateProperties({ headers: headers, selectedTabId: startId });
    }

    public getRenderedChildren() {
        var list = this.findChild(this.state.selectedTabId);
        var headers = [];
        for (var i = 0; i < this.state.headers.length; i++) {
            var header: HeaderObjectProps = this.state.headers[i];
            if (header.id === this.state.selectedTabId) {
                headers.push('<span><b>' + header.title + '</b></span>');
            } else {
                headers.push('<span>' + header.title + '</span>');
            }
        }
        return {
            headers: headers,
            list: list
        }
    }

    public getTemplate(): string {
        return `<div>{{#headers}}
                {{{.}}}
                {{/headers}}</div>
                <div>{{{list}}}</div>`;
    }
}
