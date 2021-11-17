import _ from "lodash"
import fs from "fs";
import mysql from "mysql2";

import { Logger } from "./Logger";
import { Config } from "./Config";

type ConnectionDetails = {
    host: string;
    username: string;
    password: string;
    database: string;
    port?: number;
};

class Database {

    private static _instance: Database;

    public static get instance(): Database {
        return this._instance;
    }

    /**
     * @description Creates a new database instance
     * @param {ConnectionDetails} connectionDetails
     * @param {boolean} logQueries
     * @returns {Database}
     */
    public static async makeInstance(
        connectionDetails: ConnectionDetails,
        logQueries: boolean,
    ): Promise<Database> {
        if (this._instance === undefined) {
            this._instance = new Database(connectionDetails, logQueries);
        }

        return this._instance;
    }

    private static readonly CONNECTION_DEFAULTS: any = {
        port: 3306,
        host: "127.0.0.1",
    };

    private _client: any;

    private _logQueries: boolean;

    constructor(connectionDetails: ConnectionDetails, logQueries: boolean) {
        const config: ConnectionDetails = _.defaults(connectionDetails, Database.CONNECTION_DEFAULTS);

        this._client = mysql.createConnection(config);
        this._logQueries = logQueries;
    }

    /**
     * @description Ends the mysql connection
     */
    public disconnect(): void {
        this._client.end();
    }

    /**
     * @description Returns selected items from the database
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promise<any[]>}
     */
    public async select(query: string, params?: any[]): Promise<any[]> {
        this.logQuery(query, params);

        return this._client.query(query, params);
    }

    /**
     * @description Returns the number of updated rows
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promise<number>}
     */
    public async update(query: string, params?: any[]): Promise<number> {
        this.logQuery(query, params);
        const results: any = await this._client.query(query, params);

        return results.affectedRows;
    }

    /**
     * @description Returns the number of deleted rows
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promise<number>}
     */
    public async delete(query: string, params?: any[]): Promise<number> {
        this.logQuery(query, params);
        const results: any = await this._client.query(query, params);

        return results.affectedRows;
    }

    /**
     * @description Returns the last inserted ID
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promsise<any>}
     */
    public async insert(query: string, params?: any[]): Promise<any> {
        this.logQuery(query, params);
        const results: any = await this._client.query(query, params);

        return results.insertId;
    }

    /**
     * @description Returns a raw query result
     * @param {string} query
     * @param {any[]=} params
     * @returns {Promise<any>}
     */
    public async query(query: string, params?: any[]): Promise<any> {
        this.logQuery(query, params);
        const results: any = await this._client.query(query, params);

        return results;
    }

    /**
     * @description Logs the query to stdout
     * @param {string} query
     * @param {any[]=} params
     */
    private async logQuery(
        query: string,
        params?: any[],
    ): Promise<void> {

        if (!this._logQueries) {
            return;
        }

        query = query.replace(/\s+/g, " ");
        if (params !== undefined) {
            const _params: any[] = _.clone(params);
            while(_params.length > 0) {
                query = query.replace("?", _.first(_params));
                _params.shift();
            }
        }

        const date: Date = new Date();
        const timestamp: string = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        Logger.instance.debug("query-debug", `[${timestamp}] ${query}`);
    }
}

export {
    Database,
    ConnectionDetails,
};
