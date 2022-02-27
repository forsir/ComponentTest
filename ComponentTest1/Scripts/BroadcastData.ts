export class BroadcastData {
    sender: any;
    actions: any = {};

    constructor(sender: any, actions: any[]) {
        this.sender = sender;

        for (let i = 0, l = actions.length; i < l; i++) {
            let action = actions[i];
            if (typeof action === "string") {
                this.actions[action] = null;
            } else {
                this.actions = { ...this.actions, ...action };
            }
        }
    }

    hasAction(...classes: string[]) {
        for (let i = 0, l = classes.length; i < l; i++) {
            let a: string = classes[i];
            if (this.actions[a] !== undefined) {
                return true;
            }
        }

        return false;
    }

    getAction(action: any) {
        return (this.actions[action] !== undefined) ? this.actions[action] : null;
    }
}
