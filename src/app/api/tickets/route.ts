// Imports

import {NextRequest, NextResponse} from "next/server";
import {handleApiResponse} from "@/lib/core/helper";
import { createNewTicket, getAllTickets } from "@/lib/service/ticket.service";

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

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const body = await request.json();
        
        if(!body.title || !body.description || !body.status || !body.created_by_user_id || !body.assigned_to_user_id) {
            return handleApiResponse(false, 'Missing required fields', null);
        }

        const createNewTicketResult = await createNewTicket(body);
        if(!createNewTicketResult.status) {
            return handleApiResponse(false, createNewTicketResult.message, null);
        }

        return handleApiResponse(true, 'Ticket created successfully', createNewTicketResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

