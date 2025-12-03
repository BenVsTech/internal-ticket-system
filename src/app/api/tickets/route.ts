// Imports

import {NextRequest, NextResponse} from "next/server";
import {handleApiResponse} from "@/lib/core/helper";
import { getAllTickets } from "@/lib/service/ticket.service";

// Exports

export async function GET(request: NextRequest): Promise<NextResponse> {
    try{

        const tickets = await getAllTickets();
        if(!tickets.status) {
            return handleApiResponse(false, tickets.message, null);
        }

        return handleApiResponse(true, 'Tickets retrieved successfully', tickets.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

