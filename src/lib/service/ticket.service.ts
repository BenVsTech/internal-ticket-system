// Imports

import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { getAllRowsFromTable, getRowById } from "@/lib/core/database/queries";
import { handleCloseDatabaseConnections } from "@/lib/core/helper";
import { Ticket, User } from "@/types/database";
import { TicketComponent } from "@/types/component";
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

        const ticketData = await getAllRowsFromTable(dbClient, 'ticket');
        if(!ticketData.status) {
            return {
                status: false,
                data: null,
                message: ticketData.message
            };
        }

        const tickets = ticketData.data as Ticket[];

        const returnData: TicketComponent[] = [];

        for(const ticket of tickets) {

            const createdUserObject = await getRowById(dbClient, 'users', ticket.created_by_user_id);
            if(!createdUserObject.status) {
                return {
                    status: false,
                    data: null,
                    message: createdUserObject.message
                };
            }

            const assignedUserObject = await getRowById(dbClient, 'users', ticket.assigned_to_user_id);
            if(!assignedUserObject.status) {
                return {
                    status: false,
                    data: null,
                    message: assignedUserObject.message
                };
            }

            const createdUser = createdUserObject.data as User;
            const assignedUser = assignedUserObject.data as User;

            returnData.push({
                id: ticket.id,
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                created: {
                    id: createdUser.id,
                    name: createdUser.name,
                },
                assignedTo: {
                    id: assignedUser.id,
                    name: assignedUser.name,
                },
                createdAt: new Date(ticket.created_at),
                updatedAt: new Date(ticket.updated_at),
            });

        }
        
        return {
            status: true,
            data: returnData,
            message: 'Tickets retrieved successfully'
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


