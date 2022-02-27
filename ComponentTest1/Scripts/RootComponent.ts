import { DOM } from "./DOM";
import { Component, ComponentOptions } from "./Component";
import { Logger } from "./Logger";
import { PageComponentProps } from "./PageComponent";
//import { MessageDialogComponent, MessageDialogProps } from "./components/messagedialog/MessageDialogComponent";

//DOM.define("message-dialog", MessageDialogComponent);

export interface RootComponentProps extends ComponentOptions {
    page: PageComponentProps
}

export class RootComponent extends Component {
    static root: RootComponent;

    constructor(opts: ComponentOptions = {}) {
        //RootComponent.root = this;

        super(opts);
    }
}
