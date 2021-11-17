class Logger {
    private static _instance: Logger;

    public static get instance(): Logger {
        if (this._instance === undefined) {
            this._instance = new Logger();
        }
        return this._instance;
    }

    /**
     * @description Logs an error event to stdout
     * @param {string} event
     * @param {any=} meta 
     */
    public error(event: string, meta: any): void {
        this.log("error", event, meta);
    }

    /**
     * @description Logs a success event to stdout
     * @param {string} event
     * @param {any=} meta 
     */
    public success(event: string, meta: any): void {
        this.log("success", event, meta);
    }

    /**
     * @description Logs a debug event to stdout
     * @param {string} event
     * @param {any=} meta 
     */
    public debug(event: string, meta: any): void {
        this.log("debug", event, meta);
    }

    private log(level: "error" | "success" | "debug", event: string, meta: any): void {
        console.log(`simple-migrations | [${event}]: ${meta}`);
    }
}

export { Logger };
