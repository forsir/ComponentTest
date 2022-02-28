import { ComponentInterface } from "../Component";
//import { Logger } from "./Shared/common/Logger";

export class DOM {
    static customElements: { [index: string]: () => ComponentInterface } = {};

    /**
     * Defines custom Component
     * @param {string} tagName
     * @param clazz
     */
    static define(tagName: string, clazz: any) {
        clazz.tag(tagName);
        DOM.customElements[tagName] = clazz;
    }

    static getDefinedTags(): string[] {
        let tags = [];
        for (let name in DOM.customElements) {
            tags.push(name);
        }

        return tags;
    }

    /**
     * Gets tag class constructor
     * @param {string} tagName
     * @return {ComponentInterface}
     */
    static getTagObject(tagName: string): () => ComponentInterface {
        if (!DOM.customElements) {
            return undefined;
        }

        return DOM.customElements[tagName];
    }

    ///**
    // *
    // * @param clazz
    // * @return {string|null}
    // */
    //static getTagName(clazz: ComponentInterface) {
    //    let name = clazz.constructor.name;
    //    for (let tagName in DOM.customElements) {
    //        if (name === DOM.getTagObject(tagName).name) {
    //            return tagName;
    //        }
    //    }

    //    return null;
    //}

    /**
     * Init DOM
     * Hydrates components HTML
     * @param {ComponentInterface} root
     * @param {HTMLElement} $subTree
     */

    public static mount(root: ComponentInterface, $subTree?: HTMLElement) {
        let $rootElement = $subTree || root.getElement();
        let id = $rootElement.id;

        // escape periods in ID
        let idParts = id.split(".");

        if (idParts.length > 1) {
            id = idParts.join("\\.");
        }

        let selectors = [];
        for (let name in DOM.customElements) {
            selectors.push("#" + id + " " + name);
        }

        // add data-is attribute
        selectors.push("#" + id + " " + '[data-is]');

        let selector = selectors.join(', ');

        //Logger.debug('initializing DOM inside #', root.getId());

        let $elements = $rootElement.getElementsByTagName("div");
        root.deleteAllChildren(); //Todo Store children
        for (let j = 0, count = $elements.length; j < count; j++) {
            let $e = $elements[j];

            if (($e instanceof HTMLElement)) {
                DOM.mountElement(root, $e);
            }
        }
    }

    /**
     * Hydrate HTML element
     * @param {ComponentInterface} parent
     * @param {HTMLElement} $element
     * @return {ComponentInterface|void}
     */
    private static mountElement(parent: ComponentInterface, $element: any): ComponentInterface {
        const hydratedAttrName = "data-myqhydrated";

        if ($element.hasAttribute(hydratedAttrName)) {
            return;
        }
        /*else if (!($element instanceof HTMLElement)) {
            return;
        }*/

        //Logger.debug('Hydrating', $element);

        let className = DOM.getClassName($element);

        if (!className) {
            return null;
        }

        let c = DOM.getComponentClass(className);

        if (c === undefined) {
            $element.setAttribute(hydratedAttrName, "");
            return null;
        }

        const component = new c();
        component.mount($element);
        parent.addChild($element.id, component);
        return component;
    }

    public static getState(element: HTMLElement) {
        let state = element.getAttribute('data-state') || null;
        if (state) {
            state = state.replace("\\\'", "\'");
        }

        return JSON.parse(state);
    }

    private static getClassName(element: HTMLElement) {
        let className = element.localName.toLowerCase();
        let constructor = DOM.getTagObject(className);

        if (constructor !== undefined) {
            return className;
        }

        return element.getAttribute('data-is');
    }

    public static getComponentClass(className: string): any {
        return DOM.getTagObject(className);
    }
}
