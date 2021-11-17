import _ from "lodash";

type BlueprintFieldTypeNumeric =
    "TINYINT" | "SMALLINT" | "MEDIUMINT" | "INT" | "BIGINT" | "DECIMAL" | "FLOAT" | "DOUBLE" | "BIT";
type BlueprintFieldTypeText =
    "CHAR" | "VARCHAR" | "TINYTEXT" | "TEXT" | "MEDIUMTEXT" | "LONGTEXT" | "BINARY" |
    "VARBINARY" | "TINYBLOB" | "BLOB" | "MEDIUMBLOB" | "LONGBLOB" | "ENUM" | "SET";
type BlueprintFieldTypeDate =
    "DATE" | "DATETIME" | "TIMESTAMP" | "TIME" | "YEAR";
type BlueprintFieldTypeJson =
    "JSON";

type BlueprintFieldType = BlueprintFieldTypeNumeric | BlueprintFieldTypeText | BlueprintFieldTypeDate | BlueprintFieldTypeJson;

class BlueprintField {

    private _name: string;
    private _type: BlueprintFieldType;
    private _size: number;
    private _nullable: boolean = false;
    private _autoIncrement: boolean = false;
    private _unique: boolean = false;
    private _defaultVal: any;
    private _comment: string;
    private _primary: boolean;
    private _fieldValues: string[];

    /**
     * @description Transforms a `BlueprintField` object into a valid SQL string
     * @returns {string}
     */
    public toString(): string {

        const isNull: string = this._nullable ? "NULL" : "NOT NULL";
        const defaultVal: string = this._defaultVal !== undefined ? ` DEFAULT '${this._defaultVal}'` : "";
        const autoIncrement: string = this._autoIncrement ? " AUTO_INCREMENT" : "";
        const primaryOrUnique: string = this._primary ? " PRIMARY KEY" : this._unique ? " UNIQUE KEY" : "";
        const comment: string = this._comment !== undefined ? ` COMMENT '${this._comment}'` : "";
        const valuesOrSize: string =
            this._fieldValues ? `( ${_.join(_.map(this._fieldValues, (value: string) => `'${value}'`), ", ")} )`
            :
            this._size ? `(${this._size})` : "";
        const fieldSql: string = `\`${this._name}\` ${_.toUpper(this._type)}${valuesOrSize} ${isNull}${defaultVal}${autoIncrement}${primaryOrUnique}${comment}`;

        return fieldSql;
    }

    /**
     * @description Sets the name of the field
     * @param {string} value
     * @returns {BlueprintField}
     */
    public name(value: string): BlueprintField {
        this._name = value;
        return this;
    }

    /**
     * @description Sets the type of the field
     * @param {BlueprintFieldType} value
     * @returns {BlueprintField}
     */
    public type(value: BlueprintFieldType): BlueprintField {
        this._type = value;
        return this;
    }

    /**
     * @description Sets the size of the field
     * @param {number} value
     * @returns {BlueprintField}
     */
    public size(value: number): BlueprintField {
        this._size = value;
        return this;
    }

    /**
     * @description Sets the field as nullable depending on `value`
     * @param {boolean} value
     * @returns {BlueprintField}
     */
    public nullable(value: boolean): BlueprintField {
        this._nullable = value;
        return this;
    }

    /**
     * @description Sets the field as auto increment
     * @param {boolean} value
     * @returns {BlueprintField}
     */
    public autoIncrement(value: boolean): BlueprintField {
        this._autoIncrement = value;
        return this;
    }

    /**
     * @description Sets the field as unique
     * @param {boolean} value
     * @returns {BlueprintField}
     */
    public unique(value: boolean): BlueprintField {
        this._unique = value;
        return this;
    }

    /**
     * @description Sets the default value for this field
     * @param {any} value
     * @returns {BlueprintField}
     */
    public defaultVal(value: any): BlueprintField {
        this._defaultVal = value;
        return this;
    }

    /**
     * @description Sets the comment for the field
     * @param {string} value
     * @returns {BlueprintField}
     */
    public comment(value: string): BlueprintField {
        this._comment = value;
        return this;
    }

    /**
     * @description Sets the field as primary
     * @param {boolean} value
     * @returns {BlueprintField}
     */
    public primary(value: boolean): BlueprintField {
        this._primary = value;
        return this;
    }

    /**
     * @description Sets the field values (eg for enum type)
     * @param {string[]} value
     * @returns {BlueprintField}
     */
    public fieldValues(value: string[]): BlueprintField {
        this._fieldValues = value;
        return this;
    }
}

export { BlueprintField, BlueprintFieldType };
