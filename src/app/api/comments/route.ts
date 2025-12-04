// Imports

import {NextRequest, NextResponse} from "next/server";
import {handleApiResponse} from "@/lib/core/helper";
import { createNewComment, getAllCommentsForTicket } from "@/lib/service/comment.service";

// Exports

export async function GET(request: NextRequest, { params }: { params: Promise<{ ticketId: string }> }): Promise<NextResponse> {
    try{

        const { searchParams } = new URL(request.url);
        const ticketId = searchParams.get("ticketId");

        if (!ticketId) {
            return handleApiResponse(false, "Ticket ID is required", null);
        }

        const comments = await getAllCommentsForTicket(Number(ticketId));

        if (!comments.status) {
            return handleApiResponse(false, comments.message, null);
        }

        return handleApiResponse(true, "Comments retrieved successfully", comments.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{

        const {ticketId, userId, text} = await request.json();

        if(!ticketId || !userId || !text) {
            return handleApiResponse(false, 'Missing required fields', null);
        }

        const createNewCommentResult = await createNewComment(Number(ticketId), Number(userId), text);
        if(!createNewCommentResult.status) {
            return handleApiResponse(false, createNewCommentResult.message, null);
        }

        return handleApiResponse(true, 'Comment created successfully', createNewCommentResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

