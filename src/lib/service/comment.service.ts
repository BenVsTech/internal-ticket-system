// Imports

import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { getRowsByColumnValue, getRowById, dynamicSendData, deleteRowById, updateRowById } from "@/lib/core/database/queries";
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

export async function deleteComment(id: number): Promise<DataReturnObject<boolean>> {

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

        const deleteCommentResult = await deleteRowById(dbClient, 'comment', id);
        if(!deleteCommentResult.status) {
            return {
                status: false,
                data: null,
                message: deleteCommentResult.message
            };
        }

        return {
            status: true,
            data: deleteCommentResult.data,
            message: deleteCommentResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while deleting comment'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function getCommentById(id: number): Promise<DataReturnObject<Comment>> {

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

        const getCommentByIdResult = await getRowById(dbClient, 'comment', id);
        if(!getCommentByIdResult.status) {
            return {
                status: false,
                data: null,
                message: getCommentByIdResult.message
            };
        }
        
        const comment = getCommentByIdResult.data as Comment;

        return {
            status: true,
            data: comment,
            message: getCommentByIdResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting comment by ID'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function updateComment(id: number, data: Comment): Promise<DataReturnObject<boolean>> {
    
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

        const columns = Object.keys(data);
        const values = Object.values(data);

        const updateCommentResult = await updateRowById(dbClient, 'comment', columns, values, id);
        if(!updateCommentResult.status) {
            return {
                status: false,
                data: null,
                message: updateCommentResult.message
            };
        }

        return {
            status: true,
            data: updateCommentResult.data,
            message: updateCommentResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while updating comment'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}
