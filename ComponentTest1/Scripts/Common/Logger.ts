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
}
