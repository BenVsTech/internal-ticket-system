// Imports

import { NextRequest, NextResponse } from "next/server";
import {handleApiResponse} from "@/lib/core/helper";
import { deleteComment, getCommentById, updateComment } from "@/lib/service/comment.service";

// Exports

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;
        if(!id) {
            return handleApiResponse(false, 'Comment ID is required', null);
        }

        const deleteCommentResult = await deleteComment(Number(id));
        if(!deleteCommentResult.status) {
            return handleApiResponse(false, deleteCommentResult.message, null);
        }

        return handleApiResponse(true, 'Comment deleted successfully', deleteCommentResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;
        if(!id) {
            return handleApiResponse(false, 'Comment ID is required', null);
        }

        const getCommentByIdResult = await getCommentById(Number(id));
        if(!getCommentByIdResult.status) {
            return handleApiResponse(false, getCommentByIdResult.message, null);
        }

        return handleApiResponse(true, 'Comment retrieved successfully', getCommentByIdResult.data);

    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{

        const { id } = await params;
        if(!id) {
            return handleApiResponse(false, 'Comment ID is required', null);
        }

        const body = await request.json();
        if(!body.text) {
            return handleApiResponse(false, 'Text is required', null);
        }

        const updateCommentResult = await updateComment(Number(id), body.text);
        if(!updateCommentResult.status) {
            return handleApiResponse(false, updateCommentResult.message, null);
        }

        return handleApiResponse(true, 'Comment updated successfully', updateCommentResult.data);
        
    } catch(error: unknown) {
        return handleApiResponse(false, error instanceof Error ? error.message : 'Unknown error', null);
    }
}