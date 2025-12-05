// Imports

import {NextRequest, NextResponse} from "next/server";
import {handleApiResponse} from "@/lib/core/helper";
import { createUser, getAllUsers } from "@/lib/service/user.service";

// Exports

export async function GET(request: NextRequest): Promise<NextResponse> {
    try{

        const users = await getAllUsers();
        if(!users.status) {
            return handleApiResponse(false, users.message, null);
        }

        return handleApiResponse(true, 'Users retrieved successfully', users.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{

        const body = await request.json();
        if(!body.name || !body.email || !body.team_id) {
            return handleApiResponse(false, 'Missing required fields', null);
        }

        const createUserResult = await createUser(body);
        if(!createUserResult.status) {
            return handleApiResponse(false, createUserResult.message, null);
        }

        return handleApiResponse(true, 'User created successfully', createUserResult.data);
        
    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}