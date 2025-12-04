// Imports

import { useState, useEffect } from "react";
import styles from "../page.module.css";
import { CommentComponent, CommentsProps, FormData as FormDataType } from "../../types/component";
import Form from "./form";
import { commentForm } from "@/util/forms/comment";

// Exports

export default function Comments({ setup, onClose }: CommentsProps) {

    const [showForm, setShowForm] = useState<boolean>(false);
    const [comments, setComments] = useState<CommentComponent[]>([]);
    const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

    useEffect(() => {
        console.log("User ID:", setup.userId);
        console.log("Ticket ID:", setup.ticketId);
    }, [setup.userId, setup.ticketId])

    useEffect(() => {

        const getComments = async function () {
            try{
                const response = await fetch(`/api/comments?ticketId=${setup.ticketId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if(!response.ok) {
                    console.error('Failed to fetch comments');
                    return;
                }

                const data = await response.json();

                if(data.status) {
                    setComments(data.data);
                } else {
                    console.error(data.message);
                }

            } catch(error: unknown) {
                console.error('Failed to fetch comments');
                return;
            } finally {
                setCommentsLoaded(true);
            }

        }

        getComments();

    }, [setup.ticketId])

    const handleCreateComment = async (data: FormDataType) => {
        try{
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ticketId: setup.ticketId, userId: setup.userId, text: data.text }),
            });

            if(!response.ok) {
                console.error('Failed to create comment');
                return;
            }

            const responseData = await response.json();

            if(responseData.status) {
                console.log('Comment created successfully');
            } else {
                console.error(responseData.message);
            }

        } catch(error: unknown) {
            console.error('Failed to create comment');
            return;
        }
    }

    const handleDeleteComment = async (commentId: number) => {
        try{

            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if(!response.ok) {
                console.error('Failed to delete comment');
                return;
            }

            const responseData = await response.json();
            
            if(responseData.status) {
                setComments((prev) => prev.filter((comment: CommentComponent) => comment.id !== commentId));
            } else {
                console.error(responseData.message);
            }
            
        } catch(error: unknown) {
            console.error('Failed to delete comment');
            return;
        }
    }

    const toggleSettings = (commentId: number) => {
        setSelectedCommentId(prev => prev === commentId ? null : commentId);
    }

    if(!commentsLoaded) {
        return (
            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]} ${styles["background-style-primary"]}`}>
                Loading...
            </div>
        )
    }

    if(showForm) {
        return (
            <Form 
                setup={{
                    api: selectedCommentId ? `/api/comments/${selectedCommentId}` : null,
                    content: commentForm,
                }} 
                onClose={() => setShowForm(false)} 
                onSubmit={(data: FormDataType) => {
                    handleCreateComment(data);
                    setShowForm(false);
                }} 
            />
        )
    }

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>
            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-10"]}`}>
                <h1 className={`${styles["title-text"]}`}>Comments for Ticket {setup.ticketId}</h1>
                <button 
                    className={`${styles["button-structure"]} ${styles["secondary-button"]}`}
                    onClick={() => onClose()}
                >
                    Close
                </button>
            </div>

            <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

                {
                    comments.length === 0 ? (
                        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]} ${styles["background-style-primary"]}`}>
                            No commment made
                        </div>
                    ) : (
                        comments.map((comment: CommentComponent) => (
                            <div key={comment.id} className={`${styles["column-container"]} ${styles["width-100"]} ${styles["pd-all-round"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]} ${styles["background-style-primary"]} ${styles["rounded"]}`}>
                                <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-10"]}`}>
                                    <p>{comment.text}</p>
                                    <img 
                                        src="/assets/settings.png" 
                                        alt="Settings" 
                                        className={`${styles["icon-structure"]} ${styles["clickable"]}`} 
                                        onClick={() => toggleSettings(comment.id)}
                                    />
                                </div>
                                <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-10"]}`}>
                                    <span className={`${styles["text-small"]}`}>
                                        <b>{comment.author.name} - {new Date(comment.updatedAt).toISOString().split("T")[0]}</b>
                                    </span>
                                </div>
                                {selectedCommentId === comment.id && (
                                    <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["gap-5"]} ${styles["pd-all-round"]} ${styles["background-style-secondary"]} ${styles["rounded"]}`}>
                                        <p 
                                            className={`${styles["clickable"]}`} 
                                            onClick={() => {
                                                setSelectedCommentId(comment.id);
                                                setShowForm(true);
                                            }}
                                        >
                                            Edit
                                        </p>
                                        <p 
                                            className={`${styles["clickable"]}`}
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            Delete
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )
                }

            </div>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-center"]} ${styles["align-center"]} ${styles["gap-10"]}`}>
                <button 
                    className={`${styles["button-structure"]} ${styles["primary-button"]}`} 
                    onClick={() => setShowForm(true)}
                >
                    Add Comment
                </button>
            </div>
        </div>
    )
}