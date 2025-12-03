// Imports

import { useState, useEffect } from "react";
import styles from "../page.module.css";
import { CommentsProps, FormData as FormDataType } from "../../types/component";
import Form from "./form";
import { commentForm } from "@/util/forms/comment";

// Exports

export default function Comments({ setup, onClose }: CommentsProps) {

    const [showForm, setShowForm] = useState<boolean>(false);

    useEffect(() => {
        console.log("User ID:", setup.userId);
        console.log("Ticket ID:", setup.ticketId);
    }, [setup.userId, setup.ticketId])

    if(showForm) {
        return (
            <Form 
                setup={{
                    api: null,
                    content: commentForm,
                }} 
                onClose={() => setShowForm(false)} 
                onSubmit={(data: FormDataType) => {
                    console.log("Comment form submitted:", data);
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