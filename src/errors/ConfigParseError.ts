class ConfigParseError extends Error {
    constructor() {
        super("Failed parsing configuration.");
    }
}

export { ConfigParseError };
