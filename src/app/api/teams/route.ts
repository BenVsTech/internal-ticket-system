// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { createTeam, getAllTeams } from "@/lib/service/team.service";

// Exports

export async function GET(request: NextRequest): Promise<NextResponse> {
    try{

        const teams = await getAllTeams();
        if(!teams.status || !teams.data) {
            return handleApiResponse(false, teams.message, null);
        }

        return handleApiResponse(true, 'Teams retrieved successfully', teams.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{

        const body = await request.json();
        if(!body.name || !body.description) {
            return handleApiResponse(false, 'Missing required fields', null);
        }

        const team = await createTeam(body);
        if(!team.status) {
            return handleApiResponse(false, team.message, null);
        }

        return handleApiResponse(true, 'Team created successfully', team.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}