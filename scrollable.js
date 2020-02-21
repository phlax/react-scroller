

export class Scrollable {
    listeners = {};

    constructor (formatter, fetch) {
        this.formatter = formatter;
	this.fetch = fetch;
    }

    listen = (signal, func) => {
        if (!(signal in this.listeners)) {
            this.listeners[signal] = [];
        }
        this.listeners[signal].push(func);
    };

    unlisten = () => {
	this.listeners = {};
    };

    emit = (signal, msg) => {
        for (let func of this.listeners[signal] || []) {
            func(signal, msg);
        }
    };

    text = (msg) => {
        if (this.formatter) {
            return this.formatter(msg);
        }
        return msg;
    };

    number = (num) => {
	return new Intl.NumberFormat(navigator.language).format(num);
    };
}
