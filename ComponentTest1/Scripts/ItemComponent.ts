import { Component, ComponentProps } from "./Component";

export interface ItemComponentProps extends ComponentProps {
}

export class ItemComponent extends Component {
    protected props: ItemComponentProps;

    //constructor(opts: ItemComponentProps) {
    //    super(opts);
    //}
}
