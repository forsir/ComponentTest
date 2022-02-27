import { Component, ComponentOptions } from "./Component";
import { TextItemComponent } from "./TextItemComponent";

export interface ListComponentProps extends ComponentOptions {
    items: []
}

export class ListComponent extends Component {
    protected props: ListComponentProps;

    items: Component[]

    constructor(opts: ListComponentProps) {
        super(opts);
        this.items = opts.items.map((item) => new TextItemComponent(item));
    }

    //public getRenderedChildren() {
    //    return {
    //        itemComponents:
    //            this.items.map((item)=> item.)
    //    }
    //}

    public getTemplate(): string {
        return `{{#itemComponents}}
                * {{getRenderedContent}}
                {{/items}}`;
    }
}
