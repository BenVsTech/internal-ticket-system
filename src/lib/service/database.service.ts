// Imports

import { localDatabaseConfiguration } from "@/util/local-db";
import { connectToDatabase, closeDatabaseConnection, DatabaseClient } from "@/lib/core/database";
import { DataReturnObject } from "@/types/helper";
import { handleCloseDatabaseConnections } from "@/lib/core/helper";
import { checkIfDatabaseExists, createDatabase, createDatabaseSchema } from "@/lib/core/database/queries";

// Export services

export async function createLocalDatabase(): Promise<DataReturnObject<boolean>> {

    let temporaryDbClient: DatabaseClient | null = null;
    let dbClient: DatabaseClient | null = null;

    try{

        const temporaryDbConnection = await connectToDatabase(true);
        if(!temporaryDbConnection.status || !temporaryDbConnection.data) {
            return {
                status: false,
                data: null,
                message: temporaryDbConnection.message
            };
        }

        temporaryDbClient = temporaryDbConnection.data;

        const databaseExists = await checkIfDatabaseExists(temporaryDbClient, localDatabaseConfiguration.name);
        if(!databaseExists.status) {
            return {
                status: false,
                data: null,
                message: databaseExists.message
            };
        }

        if(databaseExists.data) {
            return {
                status: true,
                data: true,
                message: 'Database already exists'
            };
        }

        const createDatabaseResult = await createDatabase(temporaryDbClient, localDatabaseConfiguration.name);
        if(!createDatabaseResult.status) {
            return {
                status: false,
                data: null,
                message: createDatabaseResult.message
            };
        }

        const closeTemporaryDatabaseConnection = await closeDatabaseConnection(temporaryDbClient);
        if(!closeTemporaryDatabaseConnection.status) {
            return {
                status: false,
                data: null,
                message: closeTemporaryDatabaseConnection.message
            };
        }

        const databaseConnection = await connectToDatabase(false);
        if(!databaseConnection.status || !databaseConnection.data) {
            return {
                status: false,
                data: null,
                message: databaseConnection.message
            };
        }

        dbClient = databaseConnection.data;

        const createDatabaseSchemaResult = await createDatabaseSchema(dbClient, localDatabaseConfiguration);
        if(!createDatabaseSchemaResult.status) {
            return {
                status: false,
                data: null,
                message: createDatabaseSchemaResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: 'Database Created Successfully'
        };

    } catch(error: unknown) {
        
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating local database'
        };

    } finally{

        await handleCloseDatabaseConnections(temporaryDbClient, dbClient);

    }
}

