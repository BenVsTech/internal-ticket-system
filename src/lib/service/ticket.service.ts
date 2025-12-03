// Imports

import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { dynamicSendData, getAllRowsFromTable, getRowById, updateRowById } from "@/lib/core/database/queries";
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

export async function archiveTicket(id: number): Promise<DataReturnObject<boolean>> {
    
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

        const updateResult = await updateRowById(dbClient, 'ticket', ['status'], ['archived'], id);
        if(!updateResult.status) {
            return {
                status: false,
                data: null,
                message: updateResult.message
            };
        }

        return {
            status: true,
            data: updateResult.data,
            message: updateResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while archiving ticket'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function createNewTicket(data: Ticket): Promise<DataReturnObject<boolean>> {

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

        const createNewTicketResult = await dynamicSendData(
            dbClient, 
            'ticket', 
            ['title', 'description', 'status', 'created_by_user_id', 'assigned_to_user_id'], 
            [data.title, data.description, data.status, data.created_by_user_id, data.assigned_to_user_id]
        );
        if(!createNewTicketResult.status) {
            return {
                status: false,
                data: null,
                message: createNewTicketResult.message
            };
        }

        return {
            status: true,
            data: createNewTicketResult.data,
            message: createNewTicketResult.message
        };

    } catch (error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating new ticket'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function updateTicket(id: number, data: Ticket): Promise<DataReturnObject<boolean>> {

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

        const updateTicketResult = await updateRowById(dbClient, 'ticket', ['title', 'description', 'status', 'created_by_user_id', 'assigned_to_user_id'], [data.title, data.description, data.status, data.created_by_user_id, data.assigned_to_user_id], id);
        if(!updateTicketResult.status) {
            return {
                status: false,
                data: null,
                message: updateTicketResult.message
            };
        }

        return {
            status: true,
            data: updateTicketResult.data,
            message: updateTicketResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while updating ticket'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function getTicketById(id: number): Promise<DataReturnObject<Ticket>> {

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

        const getTicketByIdResult = await getRowById(dbClient, 'ticket', id);
        if(!getTicketByIdResult.status) {
            return {
                status: false,
                data: null,
                message: getTicketByIdResult.message
            };
        }
        
        const ticket = getTicketByIdResult.data as Ticket;

        return {
            status: true,
            data: ticket,
            message: getTicketByIdResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting ticket by ID'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}
