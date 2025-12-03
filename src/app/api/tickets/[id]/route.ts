// Imports

import { NextRequest, NextResponse } from "next/server";
import {handleApiResponse} from "@/lib/core/helper";
import { archiveTicket } from "@/lib/service/ticket.service";

// Exports

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;

        if(!id) {
            return handleApiResponse(false, 'Ticket ID is required', null);
        }

        const archiveResult = await archiveTicket(Number(id));
        if(!archiveResult.status) {
            return handleApiResponse(false, archiveResult.message, null);
        }

        return handleApiResponse(true, 'Ticket archived successfully', archiveResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}