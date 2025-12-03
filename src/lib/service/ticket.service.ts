// Imports

import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { getAllRowsFromTable } from "@/lib/core/database/queries";
import { handleCloseDatabaseConnections } from "@/lib/core/helper";
import { DataReturnObject } from "@/types/helper";

// Exports

export async function getAllTickets(): Promise<DataReturnObject<any[]>> {

    let dbClient: DatabaseClient | null = null;

    try{

        const dbConnection = await connectToDatabase(false);
        if(!dbConnection.status || !dbConnection.data) {
            return {
                status: false,
                data: null,
                message: dbConnection.message
            };
        }
        
        dbClient = dbConnection.data;

        const tickets = await getAllRowsFromTable(dbClient, 'ticket');
        if(!tickets.status) {
            return {
                status: false,
                data: null,
                message: tickets.message
            };
        }
        
        return {
            status: true,
            data: tickets.data,
            message: tickets.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting all tickets'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}


