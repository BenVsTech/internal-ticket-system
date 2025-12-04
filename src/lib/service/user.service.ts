// Imports

import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { getAllRowsFromTable } from "@/lib/core/database/queries";
import { handleCloseDatabaseConnections } from "@/lib/core/helper";
import { User } from "@/types/database";
import { DataReturnObject } from "@/types/helper";
import { error } from "console";

// Exports

export async function getAllUsers(): Promise<DataReturnObject<User[]>> {

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

        const userData = await getAllRowsFromTable(dbClient, 'users');
        if(!userData.status) {
            return {
                status: false,
                data: null,
                message: userData.message
            };
        }
        
        const users = userData.data as User[];

        const returnData: User[] = [];

        for(const user of users) {
            returnData.push({
                id: user.id,
                name: user.name,
                email: user.email,
                team_id: user.team_id,
                created_at: user.created_at,
                updated_at: user.updated_at,
            });
        }

        return {
            status: true,
            data: returnData,
            message: 'Users retrieved successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting all users'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}
