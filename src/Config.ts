import { ConfigParseError } from "./errors/ConfigParseError";

import _ from "lodash";

class Config {

    private static _instance: Config;

    public static get instance(): Config {
        if (this._instance === undefined) {
            this._instance = new Config();
        }
        return this._instance;
    }

    private static readonly CONFIG_FILE: string = "./simple-migrations-config.json";

    private _configData: any;

    constructor() {
        try {
            this._configData = require(Config.CONFIG_FILE);
        } catch (error) {
            throw new ConfigParseError();
        }
    }

    /**
     * @description Returns a value from config
     * @param {string} path
     * @param {T} defaultVal 
     * @returns {T}
     */
    public get<T = any>(path: string, defaultVal: T = undefined as unknown as T): T {
        return _.get<T>(this._configData, path, defaultVal);
    }
}

export { Config };
