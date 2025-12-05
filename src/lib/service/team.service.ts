// Imports

import { DatabaseClient, connectToDatabase } from "@/lib/core/database";
import { handleCloseDatabaseConnections } from "@/lib/core/helper";
import { dynamicSendData, getAllRowsFromTable, getRowById, getRowsByColumnValue, updateRowById } from "@/lib/core/database/queries";
import { TeamComponent } from "@/types/component";
import { Team } from "@/types/database";
import { DataReturnObject } from "@/types/helper";

// Exports

export async function getAllTeams(): Promise<DataReturnObject<TeamComponent[]>> {

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

        const teamData = await getAllRowsFromTable(dbClient, 'team');
        if(!teamData.status) {
            return {
                status: false,
                data: null,
                message: teamData.message
            };
        }

        const teams = teamData.data as Team[];

        const returnData: TeamComponent[] = [];

        for(const team of teams) {

            const teamMemberCount = await getRowsByColumnValue(dbClient, 'users', 'team_id', team.id.toString());
            if(!teamMemberCount.status || !teamMemberCount.data) {
                return {
                    status: false,
                    data: null,
                    message: teamMemberCount.message
                };
            }

            returnData.push({
                id: team.id,
                name: team.name,
                description: team.description,
                memberCount: teamMemberCount.data.length,
                createdAt: new Date(team.created_at),
            });

        }

        return {
            status: true,
            data: returnData,
            message: 'Teams retrieved successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting all teams'
        };
    } finally {
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function getTeamById(id: number): Promise<DataReturnObject<Team>> {

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

        const team = await getRowById(dbClient, 'team', id);
        if(!team.status) {
            return {
                status: false,
                data: null,
                message: team.message
            };
        }

        return {
            status: true,
            data: team.data as Team,
            message: team.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while getting team by ID'
        };
    } finally {
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function createTeam(team: Team): Promise<DataReturnObject<boolean>> {

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

        const createTeamResult = await dynamicSendData(dbClient, 'team', ['name', 'description'], [team.name, team.description]);
        if(!createTeamResult.status) {
            return {
                status: false,
                data: null,
                message: createTeamResult.message
            };
        }

        return {
            status: true,
            data: true,
            message: createTeamResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating team'
        };
    } finally {
        await handleCloseDatabaseConnections(null, dbClient);
    }
}

export async function updateTeam(id: number, team: Team): Promise<DataReturnObject<boolean>> {

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

        const columns = Object.keys(team);
        const values = Object.values(team);

        const updateTeamResult = await updateRowById(dbClient, 'team', columns, values, id);
        if(!updateTeamResult.status) {
            return {
                status: false,
                data: null,
                message: updateTeamResult.message
            };
        }

        return {
            status: true,
            data: updateTeamResult.data,
            message: updateTeamResult.message
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while updating team'
        };
    } finally {
        await handleCloseDatabaseConnections(null, dbClient);
    }
}