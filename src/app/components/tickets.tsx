// Imports

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { TicketComponent, TicketsProps } from "../../types/component";
import Table from "./table";

// Exports

export default function Tickets({ setup }: TicketsProps) {

    const [tickets, setTickets] = useState<TicketComponent[]>([]);

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

            if(!data.status) {
                console.error('Failed to fetch tickets');
                return;
            }

            const filteredTickets = setup.isPersonalTickets
                ? data.data.filter((ticket: TicketComponent) => ticket.assignedTo.id === setup.userId)
                : data.data;

            setTickets(filteredTickets);

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
                    data: tickets.map((ticket) => [
                        ticket.id.toString(),
                        ticket.title,
                        ticket.description,
                        ticket.created.name,
                        ticket.assignedTo.name,
                    ]),
                    clickable: true,
                    onClick: (ticketId: number) => {
                        console.log(`Ticket ${ticketId} clicked`);
                    },
                }}
            />

        </div>
    )
}