import { ComponentInterface } from "../Component";

let items: ComponentInterface[] = [];

export function clearRender() {
    items = [];
}

export function enqueueRender(component: ComponentInterface) {
    if (component.isDirty() && items.push(component) == 1) {
        window.setTimeout(rerender, 0);
    }
}

export function rerender() {
    let component, list = items;
    items = [];

    console.log("render", list);

    for (let i in list) {
        component = list[i];
        if (component.isDirty() && !component.getParent().isDirty()) {
            component.render();
        }
    }
}
