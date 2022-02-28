import { render } from "mustache";
import { Component, ComponentOptions } from "./Component";
import { PageComponent, PageComponentProps } from "./PageComponent";

export interface RootComponentProps extends ComponentOptions {
    page: PageComponentProps
}

export class RootComponent extends Component {
    public static root: RootComponent;

    constructor(props: PageComponentProps) {
        super(props);

        RootComponent.root = this;

        this.addChild('page', new PageComponent(props));
    }

    getTemplate() {
        return "{{page}}";
    }

    public getRenderedContent(): string {
        const template = this.getTemplate();

        this.markDirty(false);
        if (template) {
            var partials;
            var renderedState = <{ [key: string]: any }>{ ...this.state, ...this.getRenderedChildren() };

            for (let key in this.children) {
                let child = this.children[key];
                renderedState[key] = child.getRenderedContent();
            }

            return render(template, renderedState, partials);
        }
    }
}
