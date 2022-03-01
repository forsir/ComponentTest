import { InternalEvent } from "./Common/InternalEvent";
import { ItemComponent, ItemComponentProps } from "./ItemComponent";

export interface CheckBoxItemComponentProps extends ItemComponentProps {
    description: string,
    value: boolean
}

export class CheckBoxItemComponent extends ItemComponent {
    constructor(opts: CheckBoxItemComponentProps) {
        super(opts);
    }

    protected onMount(): void {
        super.onMount();
        this.on("click", "onClick");
    }

    public getTemplate(): string {
        return `<span style="font-weight:bold">{{description}}:</span>
                <span>{{#value}}checked{{/value}}{{^value}}not{{/value}}</span>`;
    }

    private onClick(): void {
        console.log('clicked');
        this.broadcast("checkbox-click", null);
        this.updateStateProperties({ value: !this.state.value });
    }
}