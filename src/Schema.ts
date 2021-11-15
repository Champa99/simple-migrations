import _ from "lodash";

import { Container } from "../src/Container";
import { IDatabase } from "../src/database";
import { Blueprint, BlueprintOptions } from "./Blueprint";
import { Config } from "../src/Config";

class Schema {

    private _database: IDatabase;

    constructor() {
        this._database = Container.instance.get("database");
    }

    public async table(name: string, callback: (table: Blueprint) => any): Promise<void> {
        
        const options: BlueprintOptions = {
            engine: Config.get("database.engine", "InnoDB"),
            charset: Config.get("database.charset", "utf8"),
            collate: Config.get("database.collation", "utf8_croatian_ci"),
            name,
        };
        const blueprint: Blueprint = new Blueprint(options);

        callback(blueprint);

        const compiledQueries: string[] = blueprint.compileSql();

        for (let query of compiledQueries) {
            await this._database.query(query);
            // console.log(query);
        }
    }

    public async dropTable(name: string): Promise<void> {
        this._database.query(`DROP TABLE ${name}`);
    }
}

export { Schema };
