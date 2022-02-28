import { CheckBoxItemComponent } from "./CheckBoxItemComponent";
import { Component, ComponentProps } from "./Component";
import { DatasetItemComponent } from "./DatasetItemComponent";
import { ItemComponent } from "./ItemComponent";
import { TextItemComponent } from "./TextItemComponent";

export interface ListComponentProps extends ComponentProps {
    items: []
}

export class ListComponent extends Component {
    protected props: ListComponentProps;

    constructor(props: ListComponentProps) {
        super(props);
        for (var i = 0; i < props.items.length; i++) {
            this.addChild(null, this.createChildren(props.items[i]));
        }
    }

    private createChildren(props: any) {
        if (props.type == 1) {
            return new TextItemComponent(props);
        }
        if (props.type == 2) {
            return new CheckBoxItemComponent(props);
        }
        if (props.type == 3) {
            return new DatasetItemComponent(props);
        }
        return new ItemComponent(props);
    }

    public getRenderedChildren() {
        console.log({ children: this.getChildren() });

        return {
            children: this.getChildren().map(c => c.getRenderedContent())
        }
    }

    public getTemplate(): string {
        return `{{#children}}
                {{{.}}}
                {{/children}}`;
    }
}
