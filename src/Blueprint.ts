import _ from "lodash";

import { BlueprintField, BlueprintFieldType } from "./BlueprintField";

type BlueprintEngine = "InnoDB" | "XtraDB" | "Aria" | "MyISAM" | "MyRocks" | "Archive" | "BLACKHOLE";

type BlueprintOptions = {
    engine: BlueprintEngine;
    charset: string;
    collate: string;
    name: string;
};

type BlueprintIndex = {
    name: string;
    fields: string[];
};

class Blueprint {

    private _fields: BlueprintField[] = [];
    private _options: BlueprintOptions;
    private _uniqueIndexes: BlueprintIndex[] = [];

    constructor(defaultOptions: BlueprintOptions) {
        this._options = defaultOptions;
    }

    private createField(type: BlueprintFieldType, name: string, val: number | string[]): BlueprintField {
        const field: BlueprintField = new BlueprintField();
        field.name(name).type(type);
        (typeof val === "number") ? field.size(val) : field.fieldValues(val);

        this._fields.push(field);

        return field;
    }

    //#region Integer fields

    public tinyint(name: string, size?: number): BlueprintField {
        return this.createField("TINYINT", name, size);
    }

    public smallint(name: string, size?: number): BlueprintField {
        return this.createField("SMALLINT", name, size);
    }

    public mediumint(name: string, size?: number): BlueprintField {
        return this.createField("MEDIUMINT", name, size);
    }

    public int(name: string, size?: number): BlueprintField {
        return this.createField("INT", name, size);
    }

    public bigint(name: string, size?: number): BlueprintField {
        return this.createField("BIGINT", name, size);
    }

    public float(name: string, size?: number): BlueprintField {
        return this.createField("FLOAT", name, size);
    }

    public double(name: string, size?: number): BlueprintField {
        return this.createField("DOUBLE", name, size);
    }

    public bit(name: string, size?: number): BlueprintField {
        return this.createField("BIT", name, size);
    }

    //#endregion

    //#region Text fields

    public char(name: string, size: number): BlueprintField {
        return this.createField("CHAR", name, size);
    }

    public varchar(name: string, size: number): BlueprintField {
        return this.createField("VARCHAR", name, size);
    }

    public tinytext(name: string, size?: number): BlueprintField {
        return this.createField("TINYTEXT", name, size);
    }

    public text(name: string, size?: number): BlueprintField {
        return this.createField("TEXT", name, size);
    }

    public mediumtext(name: string, size?: number): BlueprintField {
        return this.createField("MEDIUMTEXT", name, size);
    }

    public longtext(name: string, size?: number): BlueprintField {
        return this.createField("LONGTEXT", name, size);
    }

    public binary(name: string, size: number): BlueprintField {
        return this.createField("BINARY", name, size);
    }

    public varbinary(name: string, size: number): BlueprintField {
        return this.createField("VARBINARY", name, size);
    }

    public tinyblob(name: string, size?: number): BlueprintField {
        return this.createField("TINYBLOB", name, size);
    }

    public blob(name: string, size?: number): BlueprintField {
        return this.createField("BLOB", name, size);
    }

    public mediumblob(name: string, size?: number): BlueprintField {
        return this.createField("MEDIUMBLOB", name, size);
    }

    public longblob(name: string, size?: number): BlueprintField {
        return this.createField("LONGBLOB", name, size);
    }

    public enum(name: string, values: string[]): BlueprintField {
        return this.createField("ENUM", name, values);
    }

    public set(name: string, values: string[]): BlueprintField {
        return this.createField("SET", name, values);
    }

    //#endregion

    //#region Dates and time

    public date(name: string, size?: number): BlueprintField {
        return this.createField("DATE", name, size);
    }

    public datetime(name: string, size?: number): BlueprintField {
        return this.createField("DATETIME", name, size);
    }

    public timestamp(name: string, size?: number): BlueprintField {
        return this.createField("TIMESTAMP", name, size);
    }

    public time(name: string, size?: number): BlueprintField {
        return this.createField("TIME", name, size);
    }

    public year(name: string, size?: number): BlueprintField {
        return this.createField("YEAR", name, size);
    }

    //#endregion

    //#region Json Values

    public json(name: string, size?: number): BlueprintField {
        return this.createField("JSON", name, size);
    }

    //#endregion

    public get fields(): BlueprintField[] {
        return this._fields;
    }

    public set engine(value: BlueprintEngine) {
        this._options.engine = value;
    }

    public set charset(value: string) {
        this._options.charset = value;
    }

    public set collate(value: string) {
        this._options.collate = value;
    }

    public addUniqueIndex(name: string, fields: string[]): void {
        this._uniqueIndexes.push({
            name,
            fields,
        });
    }

    /**
     * @description Compiles the blueprint to SQL queries
     * @returns {string[]}
     */
    public compileSql(): string[] {

        let sql: string[] = [];
        const fieldsSql: string = this.compileFields();
        const name: string = this._options.name;
        const engine: string = this._options.engine ? ` ENGINE = ${this._options.engine}` : "";
        const charset: string = this._options.charset ? ` CHARACTER SET = ${this._options.charset}` : "";
        const collate: string = this._options.collate ? ` COLLATE = ${this._options.collate}` : "";

        // CREATE [ TEMPORARY ] TABLE [IF NOT EXISTS] table_name
        sql.push(`CREATE TABLE ${name} ( ${fieldsSql} ) ${engine}${charset}${collate};`);

        const uniqueIndexes: string[] = this.compileIndexes();
        sql.push(...uniqueIndexes);

        return sql;
    }

    /**
     * @description Compiles the indexes for the table
     * @returns {string[]}
     */
    private compileIndexes(): string[] {
        
        const sql: string[] = [];

        _.forEach(this._uniqueIndexes, (uniqueIndex: BlueprintIndex) => {
            sql.push(`CREATE UNIQUE INDEX ${uniqueIndex.name} ON ${this._options.name} ( ${_.join(uniqueIndex.fields, ", ")} );`);
        });

        return sql;
    }

    /**
     * @description Parses and compiles all `BlueprintField` into valid SQL
     * @returns {string}
     */
    private compileFields(): string {
        
        const compiled: string[] = [];

        _.forEach(this._fields, (field: BlueprintField) => {
            compiled.push(field.toString());
        });

        return _.join(compiled, ", ");
    }
}

export { Blueprint, BlueprintOptions };
