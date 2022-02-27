import { EventsListener } from "./EventsListener";
import { BroadcastData } from "./BroadcastData";
import { enqueueRender } from "./RenderQueue";
import { DOM } from "./DOM";
import { render } from 'mustache';
import { RootComponent } from "./RootComponent";

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
    mount($element: HTMLElement): void;

    unmount(): void;

    getId(): string;

    setParent(parent: ComponentInterface): void;

    getParent(): ComponentInterface;

    getTemplate(): string;

    render(): void;

    update(state: object): void;

    updateStateProperties(properties: object): void;

    setElement(element: HTMLElement): void;

    getElement(): HTMLElement;

    hasElement(): boolean;

    addChild(component: ComponentInterface): void;

    deleteChild(idx: number): void;

    deleteAllChildren(): void;

    getChildren(): { [id: string]: ComponentInterface };

    findChild(id: string): ComponentInterface;

    markDirty(isDirty?: boolean): void;

    isDirty(): boolean;

    walk(callback: Function): void;

    getRenderedChildren(): {};
}

export interface ComponentOptions {
    state?: {}
}

export abstract class Component implements ComponentInterface, EventListener {
    protected parent: ComponentInterface;
    protected children: { [id: string]: ComponentInterface } = {};
    protected cid: string;
    private state: object = {};
    private $element: HTMLElement;
    private _isDirty: boolean = true;
    private _eventResolver: EventsListener;

    protected eventSrc: EvtSource = new EvtSource();

    constructor(opts: ComponentOptions = {}) {
        if (opts.state) {
            this.setState(opts.state);
        }

        this.onCreated();
    }

    public getId(): string {
        if (!this.cid) {
            this.cid = "mqC-" + ++__uid;
        }

        return this.cid;
    }

    public setParent(parent: ComponentInterface) {
        this.parent = parent;
    }

    public getParent() {
        return this.parent;
    }

    public mount($element: HTMLElement): void {
        this.onBeforeMount($element);

        let id = this.getId();

        if (!$element.id) {
            $element.id = id;
        } else {
            id = $element.id;
        }

        this.cid = id;
        this.$element = $element;

        this._eventResolver = new EventsListener(this);

        this.onMount();
    }

    public unmount() {
        this.eventSrc.remove();
        this._eventResolver.remove();
        for (let key in this.children) {
            let child = this.children[key];
            child.unmount();
        }
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
        return this.$element || document.getElementById(this.getId());
    }

    public hasElement() {
        return !!this.$element;
    }

    public addChild(child: ComponentInterface) {
        child.setParent(this);
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
        return this.children;
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
            this._render();
            this.onAfterRender();
        }

        //for (let key in this.children) {
        //    let child = this.children[key];
        //    child.render();
        //}

        this.onAfterChildrenRendered();
    }

    public getTemplate(): string {
        return null;
    }

    public onBroadcast(ed: BroadcastData) { /* abstract */
    }

    /**
     * You can pass list of actions or a map of action -> data.
     * Examples:
     * - broadcast('action1', 'action2', ...)
     * - broadcast({action1: data, action2: data, ...})
     * @param actions
     * @returns {Component}
     */
    public broadcast(...actions: any[]) {
        let ed = new BroadcastData(this, actions);
        RootComponent.root.walk(function (component: ComponentInterface | any) {
            if (component['onBroadcast'] !== undefined) {
                component['onBroadcast'](ed);
            }
        });

        return this;
    }

    public walk(callback: Function) {
        for (let key in this.children) {
            let child = this.children[key];
            child.walk(callback);
        }
        callback(this);

        return this;
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

    public getRenderedChildren() {
        return {};
    }

    public getRenderedContent() {
        const template = this.getTemplate();

        this.markDirty(false);
        if (template) {
            var partials;
            var state = { ...this.state, ...this.getRenderedChildren() }
            return '<div id="' + this.getId() + '">' + render(template, state, partials) + '</div>';
        }
    }

    private _render() {
        this.markDirty(false);

        const template = this.getTemplate();

        if (template) {
            const rendered = this.getRenderedContent();

            let element = document.getElementById(this.getId());
            if (element) {
                if (element.innerHTML !== rendered) {
                    element.innerHTML = rendered;
                }
            }
        }
    }
}
