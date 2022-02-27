export class Logger {
    static isEnabled: boolean = false;

    static enable(enable: boolean) {
        Logger.isEnabled = enable;
    }

    static debug(msg: string, ...optionalParams: any[]) {
        Logger.log(msg, 'debug', ...optionalParams);
    }

    static info(msg: string, ...optionalParams: any[]) {
        Logger.log(msg, 'info', ...optionalParams);
    }

    static warn(msg: string, ...optionalParams: any[]) {
        Logger.log(msg, 'warn', ...optionalParams);
    }

    static error(msg: string, ...optionalParams: any[]) {
        Logger.log(msg, 'error', ...optionalParams);
    }

    static log(msg: any, type: string, ...optionalParams: any[]) {
        if (!Logger.isEnabled) {
            return;
        }

        switch (type) {
            case 'debug':
                console.debug(msg, ...optionalParams);
                break;
            case 'info':
                console.info(msg, ...optionalParams);
                break;
            case 'warn':
                console.warn(msg, ...optionalParams);
                break;
            case 'error':
                console.error(msg, ...optionalParams);
                break;
            default:
                console.log(msg, ...optionalParams);
        }
    }

    private static stringifyParam(param: any): string {
        let text: string;

        alert("2");
        if (param instanceof HTMLElement) {
            let tagName = param.localName.toLowerCase();
            text = " &lt;" + tagName
                + (param.id ? " id=\"" + param.id + "\"" : "")
                + (param.getAttribute('data-is') ? " data-is=\"" + param.getAttribute('data-is') + "\"" : "")
                + "&gt;";
        }
        else if (param === null) {
            text = "NULL";
        }
        else if (param instanceof Object) {
            text = "<i>" + param.toString() + "</i>";
        }
        else {
            text = " " + param.toString();
        }

        return " | " + text;
    }
}
