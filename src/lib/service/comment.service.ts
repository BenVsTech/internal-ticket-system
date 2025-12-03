// Imports

import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { getRowsByColumnValue, getRowById, dynamicSendData } from "@/lib/core/database/queries";
import { handleCloseDatabaseConnections } from "@/lib/core/helper";
import { Comment } from "@/types/database";
import { CommentComponent } from "@/types/component";
import { DataReturnObject } from "@/types/helper";

// Exports

export async function getAllCommentsForTicket(ticketId: number): Promise<DataReturnObject<CommentComponent[]>> {

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

        const comments = await getRowsByColumnValue(dbClient, 'comment', 'ticket_id', ticketId.toString());
        if(!comments.status) {
            return {
                status: false,
                data: null,
                message: comments.message
            };
        }

        const returnData: CommentComponent[] = [];

        for(const comment of comments.data as Comment[]) {

            const author = await getRowById(dbClient, 'users', comment.author_id);
            if(!author.status) {
                return {
                    status: false,
                    data: null,
                    message: author.message
                };
            }

            returnData.push({
                id: comment.id,
                text: comment.text,
                author: {
                    id: author.data.id,
                    name: author.data.name
                },
                updatedAt: new Date(comment.updated_at)
            });

        }

        return {
            status: true,
            data: returnData,
            message: 'Comments retrieved successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting all comments for ticket'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function createNewComment(ticketId: number, userId: number, text: string): Promise<DataReturnObject<boolean>> {

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

        const createNewCommentResult = await dynamicSendData(dbClient, 'comment', ['text', 'ticket_id', 'author_id'], [text, ticketId, userId]);
        if(!createNewCommentResult.status) {
            return {
                status: false,
                data: null,
                message: createNewCommentResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: 'Comment created successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating new comment'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

