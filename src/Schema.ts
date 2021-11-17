import _ from "lodash";

import { Blueprint, BlueprintOptions } from "./Blueprint";
import { Config } from "../src/Config";
import { Database } from "./Database";

class Schema {

    private _database: Database;

    constructor() {
        this._database = Database.instance;
    }

    /**
     * @description Creates a `Blueprint` for a new table
     * @param {string} name
     * @param {(table: Blueprint) => any} callback 
     * @returns {Promise<void>}
     */
    public async table(name: string, callback: (table: Blueprint) => any): Promise<void> {
        
        const options: BlueprintOptions = {
            engine: Config.instance.get("database.engine", "InnoDB"),
            charset: Config.instance.get("database.charset", "utf8"),
            collate: Config.instance.get("database.collation", "utf8_croatian_ci"),
            name,
        };
        const blueprint: Blueprint = new Blueprint(options);

        callback(blueprint);

        const compiledQueries: string[] = blueprint.compileSql();

        for (let query of compiledQueries) {
            await this._database.query(query);
        }
    }

    /**
     * @description Drops the table
     * @param {string} name
     * @returns {Promise<void>}
     */
    public async dropTable(name: string): Promise<void> {
        this._database.query(`DROP TABLE ${name}`);
    }
}

export { Schema };
