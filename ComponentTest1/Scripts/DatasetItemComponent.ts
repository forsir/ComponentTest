import { ItemComponent, ItemComponentProps } from "./ItemComponent";

export interface DatasetItemComponentProps extends ItemComponentProps {
    description: string,
    value: string,
    allowedValues: string[]
}

export class DatasetItemComponent extends ItemComponent {
    constructor(opts: DatasetItemComponentProps) {
        super(opts);
        this.props = opts;
    }

    public getTemplate(): string {
        return `<span style="font-weight:bold">{{description}}:</span>
                <span>{{value}}</span>`;
    }
}