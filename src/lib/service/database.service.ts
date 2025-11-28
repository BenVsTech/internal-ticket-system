// Imports

import { localDatabaseConfiguration } from "@/util/local-db";
import { connectToDatabase, closeDatabaseConnection, DatabaseClient } from "@/lib/core/database";
import { DataReturnObject } from "@/types/helper";
import { handleCloseDatabaseConnections } from "@/lib/core/helper";

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

        console.log('configuration:', localDatabaseConfiguration);

        return {
            status: true,
            data: true,
            message: temporaryDbConnection.message
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

