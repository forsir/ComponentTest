import { render } from "mustache";
import { Component, ComponentProps } from "./Component";
import { PageComponent, PageComponentProps } from "./PageComponent";

export interface RootComponentProps extends ComponentProps {
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
        return "{{>page}}";
    }

    public getRenderedContent(): string {
        const template = this.getTemplate();

        this.markDirty(false);
        if (template) {
            var partials = <{ [key: string]: any }>{ ...this.getRenderedChildren() };

            for (let key in this.children) {
                let child = this.children[key];
                partials[key] = child.getRenderedContent();
            }

            return render(template, this.state, partials);
        }
    }
}
