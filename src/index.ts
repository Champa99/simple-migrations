import { Config } from "./Config";
import { ConnectionDetails, Database } from "./Database";
import { NoConnectionDetails } from "./errors/NoConnectionDetails";

// Try to fetch the connection details
const connectionDetails: ConnectionDetails | undefined = Config.instance.get("connection");
if (connectionDetails === undefined) {
    throw new NoConnectionDetails();
}

// Initiate the database connection
Database.makeInstance(
    connectionDetails,
    Config.instance.get("logQueries", false),
);
