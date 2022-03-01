import { Logger } from "./Logger";
import { ComponentInterface } from "../Component";

export class EventsListener implements EventListenerObject {
    events: { [index: string]: any } = {};
    private readonly listener: any | ComponentInterface;

    constructor(listener: ComponentInterface) {
        this.listener = listener;
    }

    addEventListener(event: string, listener?: any) {
        const $e = <HTMLElement>this.listener.getElement();

        listener = this.resolveListener(listener, event);

        if (!listener) {
            throw new Error("Invalid event listener " + listener.toString());
        }

        this.events[event] = listener;
        Logger.debug('listening', "#" + $e.id, event);

        return $e.addEventListener(event, this, false);
    }

    removeEventListener(event?: string) {
        const $e = <HTMLElement>this.listener.getElement();
        const listener = this.events[event];

        if (!listener) {
            return;
        }

        delete this.events[event];

        return $e.removeEventListener(event, this.resolveListener(listener, event));
    }

    remove(): void {
        //TODO remove all listeners
    }

    handleEvent(e: Event) {
        let eventType: string = e.type;
        let listener = this.events[eventType];

        if (listener === undefined) {
            return;
        }

        if (e instanceof MutationEvent) {
            if (e.relatedNode !== this.listener.getElement()) {
                return;
            }
        }

        this.callListener(eventType, e);
    }

    private resolveListener(listener: any, event: string) {
        if (typeof listener === 'function') {
            return listener;
        } else if (typeof listener === 'string' && typeof this.listener[listener] === 'function') {
            return listener;
        } else if (typeof this.listener['on' + this.ucFirst(event)] === 'function') {
            return 'on' + this.ucFirst(event);
        } else if (typeof this.listener['on' + event.toLowerCase()] === 'function') {
            return 'on' + event.toLowerCase();
        } else if (typeof this.listener['on' + event] === 'function') {
            return 'on' + event;
        }

        return undefined;
    }

    private ucFirst(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    private callListener(eventType: string, event: Event) {
        let listener = this.events[eventType];

        if (typeof listener === 'function') {
            listener(event);
        } else {
            this.listener[listener](event);
        }
    }
}
