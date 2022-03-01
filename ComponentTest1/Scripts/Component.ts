import { EventsListener } from "./Common/EventsListener";
import { BroadcastData } from "./Common/BroadcastData";
import { enqueueRender } from "./Common/RenderQueue";
import { render } from 'mustache';
import { RootComponent } from "./RootComponent";
import { InternalEvent } from "./Common/InternalEvent";

let __uid = 0;

export interface EventListener {
    on(event: string, listener: any): any;

    off(event: string): any;
}

export class EvtSource {
    private evtSource: EventSource;
    private listeners: { [index: string]: any } = {};

    public open(url: string): void {
        if (this.evtSource) {
            this.remove();
        }

        this.evtSource = new EventSource(url);
    }

    public addListener(type: string, callback: (evt: Event) => void, options: boolean | AddEventListenerOptions): void {
        this.evtSource.addEventListener(type, callback, options);
        this.listeners[type] = callback;
    }

    public close(): void {
        if (!this.evtSource) return;
        this.evtSource.close();
    }

    public remove(): void {
        if (!this.evtSource) return;
        Object.keys(this.listeners).forEach((key) => {
            this.evtSource.removeEventListener(key, this.listeners[key]);
        });
        this.listeners = {}
        this.evtSource.close();
        this.evtSource = null;
    }

    public onError(callback: any): void {
        this.evtSource.onerror = callback;
    }
}

export interface ComponentInterface {
    mount($element?: HTMLElement): boolean;

    mountChildren(): void;

    unmount(): void;

    getId(): string;

    setId(id: string | undefined): void;

    setParent(parent: ComponentInterface): void;

    getParent(): ComponentInterface;

    getTemplate(): string;

    render(): void;

    update(state: object): void;

    updateStateProperties(properties: object): void;

    setElement(element: HTMLElement): void;

    getElement(): HTMLElement;

    hasElement(): boolean;

    addChild(id: string | undefined, child: ComponentInterface): void;

    deleteChild(idx: number): void;

    deleteAllChildren(): void;

    getChildren(): ComponentInterface[]; //{ [id: string]: ComponentInterface };

    findChild(id: string): ComponentInterface;

    markDirty(isDirty?: boolean): void;

    isDirty(): boolean;

    getRenderedChildren(): {};

    getRenderedContent(): string;
}

export interface ComponentProps {
    id?: string;
    state?: {};
}

export abstract class Component implements ComponentInterface, EventListener {
    protected parent: ComponentInterface;
    protected children: { [id: string]: ComponentInterface } = {};
    protected cid: string;
    protected state: any = {};
    private $element: HTMLElement;
    private _isDirty: boolean = true;
    private _eventResolver: EventsListener;

    protected eventSrc: EvtSource = new EvtSource();

    constructor(props: ComponentProps = {}) {
        if (props.state) {
            this.setState(props.state);
        }

        this.cid = props.id || "mqC-" + ++__uid;

        this.onCreated();
    }

    public getId(): string {
        return this.cid;
    }

    public setId(id: string | undefined): void {
        this.cid = id || this.cid;
    }

    public setParent(parent: ComponentInterface) {
        this.parent = parent;
    }

    public getParent() {
        return this.parent;
    }

    public mount($element?: HTMLElement): boolean {
        this.onBeforeMount($element);

        let id = this.getId();

        console.log("mount", id);

        if (!$element) {
            $element = document.getElementById(id);
            if (!$element) {
                console.log(id, "not found");
                return false;
            }
        }

        if (!$element.id) {
            $element.id = id;
        } else {
            id = $element.id;
        }

        this.cid = id;
        this.$element = $element;

        this._eventResolver = new EventsListener(this);

        this.onMount();

        return true;
    }

    public mountChildren() {
        for (let key in this.children) {
            let child = this.children[key];
            child.unmount();
            if (child.mount()) {
                child.mountChildren();
            }
        }
    }

    public unmount() {
        if (!this.$element) {
            return;
        }

        //this.eventSrc.remove();
        this._eventResolver.remove();
        for (let key in this.children) {
            let child = this.children[key];
            child.unmount();
        }
        this.$element = null;
        this.onUnmount();
    }

    public markDirty(isDirty: boolean = true) {
        this._isDirty = isDirty;
    }

    public isDirty() {
        return this._isDirty;
    }

    public setElement(element: HTMLElement) {
        this.$element = element;
    }

    public getElement(): HTMLElement {
        if (!this.hasElement()) {
            this.$element = document.getElementById(this.getId());
        }

        return this.$element;
    }

    public hasElement() {
        return !!this.$element;
    }

    public addChild(id: string | undefined, child: ComponentInterface) {
        child.setParent(this);
        child.setId(id);
        this.children[child.getId()] = child;
    }

    public deleteChild(idx: number) {
        let child = this.children[idx];

        if (!child) {
            throw Error("Child " + idx + " not found");
        }

        let $el = child.getElement();
        if ($el) {
            this.$element.removeChild($el);
        }

        this.children[idx] = undefined;
    }

    public deleteAllChildren() {
        for (let key in this.children) {
            let child = this.children[key];
            let $el = child.getElement();
            if ($el) {
                try {
                    this.$element.removeChild($el);
                } catch (e) {
                }
            }
        }
        this.children = {};
    }

    public getChildren() {
        var values = [];
        for (let key in this.children) {
            values.push(this.children[key]);
        }
        return values;
    }

    public findChild(id: string) {
        return this.children[id];
    }

    public on(event: string, listener?: any) {
        return this._eventResolver.addEventListener(event, listener);
    }

    public off(event?: string) {
        return this._eventResolver.removeEventListener(event);
    }

    public render(): void {
        let needRender = this.isDirty();
        if (this.parent) {
            needRender = needRender && !this.parent.isDirty();
        }

        if (needRender) {
            this.onBeforeRender();
            console.time("render");
            this._render();
            console.timeEnd("render");
            this.onAfterRender();
        }

        this.onAfterChildrenRendered();
    }

    public getTemplate(): string {
        return null;
    }

    public onBroadcast(ed: BroadcastData) { /* abstract */
    }

    public broadcast(actionType: string, data: any) {
        InternalEvent.Invoke(actionType, this, data);
    }

    public broadcastregister(actionType: string, action: Function) {
        InternalEvent.Register(actionType, action);
    }

    protected onCreated() { /* abstract */
    }

    protected onBeforeMount($element: HTMLElement) { /* abstract */
    }

    protected onMount() { /* abstract */
    }

    protected onUnmount() { /* abstract */
    }

    protected onBeforeRender() { /* abstract */
    }

    protected onAfterRender() { /* abstract */
    }

    protected onBeforeUpdate() { /* abstract */
    }

    protected onAfterUpdate() { /* abstract */
    }

    protected onAfterChildrenRendered() { /* abstract */
    }

    public update(state: object) {
        // update only if necessary
        if (JSON.stringify(state) !== JSON.stringify(this.state)) {
            this.markDirty();
        }

        this.setState(state);

        enqueueRender(this);
    }

    public updateStateProperties(properties: object) {
        let state = { ...this.state, ...properties };

        this.update(state);
    }

    protected getState() {
        return { ...{}, ...this.state };
    }

    /**
     * Sets component state and props
     * state is cloned (NOT DEEP CLONE)
     * @param {Object} state
     */
    protected setState(state: object) {
        this.onBeforeUpdate();
        this.state = { ...{}, ...state };
        this.onAfterUpdate();
    }

    show(): void {
        this.getElement().style.display = "block";
    }

    hide(): void {
        this.getElement().style.display = "none";
    }

    isShown(): boolean {
        return this.getElement().style.display == "block";
    }

    addClassName(className: string): void {
        if (this.hasClassName(className)) {
            return;
        }

        this.getElement().className += ' ' + className;
    }

    removeClassName(className: string): void {
        let $el = this.getElement();
        $el.className = $el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    hasClassName(className: string): boolean {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.getElement().className);
    }

    public getRoute(): string {
        return location.hash.replace('#/', '');
    }

    public getRenderedChildren(): { [key: string]: any } {
        return {};
    }

    public getRenderedContent(): string {
        const template = this.getTemplate();

        this.markDirty(false);
        if (template) {
            var renderedChildren = this.getRenderedChildren();
            var state = <{ [key: string]: any }>{ ...this.state, ...renderedChildren };
            var partials = <{ [key: string]: any }>{ ...renderedChildren };

            if (template.indexOf('{>') > 0) {
                for (let key in this.children) {
                    let child = this.children[key];
                    partials[key] = child.getRenderedContent();
                }
            }

            var result = '<div id="' + this.getId() + '">' + render(template, state, partials) + '</div>';
            //console.log(result);
            return result;
        }
    }

    private _render() {
        this.markDirty(false);

        const rendered = this.getRenderedContent();

        var hadElement = this.hasElement();

        let element = this.getElement();
        if (element) {
            if (element.innerHTML !== rendered) {
                console.log("Rendered", rendered);
                element.innerHTML = rendered;
                if (!hadElement) {
                    this.mount(element);
                }
                this.mountChildren();
            }
        }
    }
}
