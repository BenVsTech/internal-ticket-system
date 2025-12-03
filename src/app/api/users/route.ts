// Imports

import {NextRequest, NextResponse} from "next/server";
import {handleApiResponse} from "@/lib/core/helper";
import { getAllUsers } from "@/lib/service/user.service";

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