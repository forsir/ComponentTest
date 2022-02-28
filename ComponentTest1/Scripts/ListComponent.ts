import { Component, ComponentOptions } from "./Component";
import { TextItemComponent } from "./TextItemComponent";

export interface ListComponentProps extends ComponentOptions {
    items: []
}

export class ListComponent extends Component {
    protected props: ListComponentProps;

    constructor(props: ListComponentProps) {
        super(props);
        for (var i = 0; i < props.items.length; i++) {
            this.addChild(null, new TextItemComponent(props.items[i]));
        }
    }

    public getRenderedChildren() {
        return {
            children: this.getChildren()
        }
    }

    public getTemplate(): string {
        return `{{#children}}
                * {{getRenderedContent}}
                {{/children}}`;
    }
}
