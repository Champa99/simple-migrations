class NoConnectionDetails extends Error {
    constructor() {
        super("No connection details found in simple-migrations-config.json.");
    }
}

export { NoConnectionDetails };
