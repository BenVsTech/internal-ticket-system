// Imports

import styles from "../page.module.css";
import { useEffect } from "react";
import { TicketsProps } from "../../types/component";
import Table from "./table";

// Exports

export default function Tickets({ setup }: TicketsProps) {

    useEffect(() => {

        const getTickets = async function () {
            const response = await fetch('/api/tickets',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok) {
                console.error('Failed to fetch tickets');
                return;
            }

            const data = await response.json();

            console.log('Tickets:', data);
        } 
        
        getTickets();

    }, [])

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <h1 className={`${styles["title-text"]}`}>{setup.title}</h1>
                    <p>{setup.description}</p>
                </div>

                {!setup.isPersonalTickets && (
                    <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]}`}>
                        <button className={`${styles["button-structure"]} ${styles["primary-button"]}`}>Create Ticket</button>
                    </div>
                )}
            </div>

            <Table 
                setup={{
                    headers: ["ID", "Title", "Description", "Created By", "Assigned To"],
                    data: [
                        ["1", "Ticket 1", "Description 1", "Created By 1", "Assigned To 1"],
                        ["2", "Ticket 2", "Description 2", "Created By 2", "Assigned To 2"],
                        ["3", "Ticket 3", "Description 3", "Created By 3", "Assigned To 3"],
                    ],
                    clickable: true,
                    onClick: (ticketId: number) => {
                        console.log(`Ticket ${ticketId} clicked`);
                    },
                }}
            />

        </div>
    )
}