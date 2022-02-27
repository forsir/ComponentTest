import { Component, ComponentOptions } from "./Component";

export interface ItemComponentProps extends ComponentOptions {
}

export class ItemComponent extends Component {
    protected props: ItemComponentProps;

    //constructor(opts: ItemComponentProps) {
    //    super(opts);
    //}
}
