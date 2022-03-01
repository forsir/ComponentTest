import { Component } from "../Component";

export class InternalEvent {
    private static store: { [key: string]: Function[] } = {};

    public static Register(actionName: string, action: Function) {
        if (!InternalEvent.store[actionName]) {
            InternalEvent.store[actionName] = [];
        }
        InternalEvent.store[actionName].push(action);
    }

    public static Invoke(actionName: string, element: Component, data: any) {
        var actions = InternalEvent.store[actionName];
        if (!actions) {
            return;
        }
        for (var i = 0; i < actions.length; i++) {
            actions[i](element, data);
        }
    }
}