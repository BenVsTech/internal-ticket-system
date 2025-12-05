// Imports

import { NextRequest, NextResponse } from "next/server";
import { handleApiResponse } from "@/lib/core/helper";
import { getTeamById, updateTeam } from "@/lib/service/team.service";

// Exports

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;
        if(!id) {
            return handleApiResponse(false, 'Team ID is required', null);
        }

        const getTeamByIdResult = await getTeamById(Number(id));
        if(!getTeamByIdResult.status) {
            return handleApiResponse(false, getTeamByIdResult.message, null);
        }

        return handleApiResponse(true, 'Team retrieved successfully', getTeamByIdResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;
        if(!id) {
            return handleApiResponse(false, 'Team ID is required', null);
        }

        const body = await request.json();
        
        const updateTeamResult = await updateTeam(Number(id), body);
        if(!updateTeamResult.status) {
            return handleApiResponse(false, updateTeamResult.message, null);
        }

        return handleApiResponse(true, 'Team updated successfully', updateTeamResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}