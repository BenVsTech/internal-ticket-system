// Imports

import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { deleteRowById, dynamicSendData, getAllRowsFromTable, getRowById, updateRowById } from "@/lib/core/database/queries";
import { generatePassword, handleCloseDatabaseConnections } from "@/lib/core/helper";
import { UserComponent } from "@/types/component";
import { User } from "@/types/database";
import { DataReturnObject } from "@/types/helper";
import { sendEmailToUser } from "@/lib/service/email.service";

// Exports

export async function getAllUsers(): Promise<DataReturnObject<UserComponent[]>> {

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

        const users = await getAllRowsFromTable(dbClient, 'users');
        if(!users.status) {
            return {
                status: false,
                data: null,
                message: users.message
            };
        }
        const returnData: UserComponent[] = [];

        for(const user of users.data as unknown as User[]) {

            const team = await getRowById(dbClient, 'team', user.team_id);
            if(!team.status) {
                return {
                    status: false,
                    data: null,
                    message: team.message
                };
            }

            returnData.push({
                id: user.id,
                name: user.name,
                email: user.email,
                team: {
                    id: team.data.id,
                    name: team.data.name,
                },
                createdAt: new Date(user.created_at),
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
            message: error instanceof Error ? error.message : 'Unknown error while getting all users component formatted'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function getUserById(id: number): Promise<DataReturnObject<User>> {

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

        const user = await getRowById(dbClient, 'users', id);
        if(!user.status) {
            return {
                status: false,
                data: null,
                message: user.message
            };
        }

        return {
            status: true,
            data: user.data as User,
            message: user.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting user by ID'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function createUser(user: User): Promise<DataReturnObject<boolean>> {

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

        const generatePasswordResult = await generatePassword();
        if(!generatePasswordResult.status) {
            return {
                status: false,
                data: null,
                message: generatePasswordResult.message
            };
        }

        const createUserResult = await dynamicSendData(dbClient, 'users', ['name', 'email', 'password', 'team_id'], [user.name, user.email, generatePasswordResult.data, user.team_id]);
        if(!createUserResult.status) {
            return {
                status: false,
                data: null,
                message: createUserResult.message
            }
        }

        const sendEmailResult = await sendEmailToUser(user.email, 'Welcome to the system', `Welcome to the system! Your password is: ${generatePasswordResult.data}`);
        if(!sendEmailResult.status) {
            return {
                status: false,
                data: null,
                message: sendEmailResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: 'User created successfully'
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating user'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function updateUser(id: number, user: User): Promise<DataReturnObject<boolean>> {

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

        const columns = Object.keys(user);
        const values = Object.values(user);

        const updateUserResult = await updateRowById(dbClient, 'users', columns, values, id);
        if(!updateUserResult.status) {
            return {
                status: false,
                data: null,
                message: updateUserResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: updateUserResult.message
        };
        
    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while updating user'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function deleteUser(id: number): Promise<DataReturnObject<boolean>> {

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

        const deleteUserResult = await deleteRowById(dbClient, 'users', id);
        if(!deleteUserResult.status) {
            return {
                status: false,
                data: null,
                message: deleteUserResult.message
            };
        }

        return {
            status: true,
            data: deleteUserResult.data,
            message: deleteUserResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while deleting user'
        };
    } finally{
        await handleCloseDatabaseConnections(null, dbClient);
    }
}
