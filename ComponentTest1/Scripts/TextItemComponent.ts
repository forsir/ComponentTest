import { ItemComponent, ItemComponentProps } from "./ItemComponent";

export interface TextItemComponentProps extends ItemComponentProps {
    description: string,
    value: string
}

export class TextItemComponent extends ItemComponent {
    protected props: TextItemComponentProps;

    constructor(opts: TextItemComponentProps) {
        super(opts);
        this.props = opts;
    }

    public getTemplate(): string {
        return `<span style="font-weight:bold">{{description}}:</span>
                <span>{{value}}</span>`;
    }
}
