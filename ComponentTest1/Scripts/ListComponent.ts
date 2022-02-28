import { Component, ComponentProps } from "./Component";
import { TextItemComponent } from "./TextItemComponent";

export interface ListComponentProps extends ComponentProps {
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
        console.log({ children: this.getChildren() });

        return {
            children: this.getChildren()
        }
    }

    public getTemplate(): string {
        return `{{#children}}
                * {{>getRenderedContent}}
                {{/children}}`;
    }
}
