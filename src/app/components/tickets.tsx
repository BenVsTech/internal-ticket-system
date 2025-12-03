// Imports

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { TicketComponent, TicketsProps } from "../../types/component";
import Table from "./table";
import StatusDropdown from "./statusDropdown";

// Exports

export default function Tickets({ setup }: TicketsProps) {

    const [tickets, setTickets] = useState<TicketComponent[]>([]);
    const [filterBy, setFilterBy] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);

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

    const handleArchiveTicket = async (ticketId: number) => {
        try{

            const response = await fetch(`/api/tickets/${ticketId}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok) {
                console.error('Failed to fetch tickets');
                return;
            }

            const data = await response.json();

            if (data.status) {
                setTickets((prev) =>
                    prev.map((ticket) =>
                        ticket.id === ticketId
                            ? { ...ticket, status: "archived" }
                            : ticket
                    )
                );
            } else {
                console.error(data.message);
            }

        } catch(error: unknown) {
            console.error('Failed to archive ticket');
        }
    }

    if(showForm) {
        console.log('showForm');
    }

    return (
        <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-10"]}`}>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-space-between"]} ${styles["align-center"]} ${styles["gap-20"]}`}>
                <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]} ${styles["gap-5"]}`}>
                    <h1 className={`${styles["title-text"]}`}>{setup.title}</h1>
                    <p>{setup.description}</p>
                </div>

                {!setup.isPersonalTickets && (
                    <div className={`${styles["column-container"]} ${styles["content-start"]} ${styles["align-start"]}`}>
                        <button 
                            className={`${styles["button-structure"]} ${styles["primary-button"]}`}
                            onClick={() => setShowForm(true)}
                        >Create Ticket</button>
                    </div>
                )}
            </div>

            <div className={`${styles["row-container"]} ${styles["width-100"]} ${styles["content-start"]} ${styles["align-start"]}`}>
                <StatusDropdown setup={{
                    onSelect: (status: string) => {
                        setFilterBy(status);
                    }
                }} />
            </div>

            <Table 
                setup={{
                    headers: ["ID", "Title", "Description", "Status", "Created By", "Assigned To"],
                    data: tickets.map((ticket) => [
                        ticket.id.toString(),
                        ticket.title,
                        ticket.description,
                        ticket.status,
                        ticket.created.name,
                        ticket.assignedTo.name,
                    ]),
                    filterBy: filterBy,
                    clickable: true,
                    onClick: (ticketId: number) => {
                        console.log(`Ticket ${ticketId} clicked`);
                    },
                    archiveable: true,
                    onArchive: (ticketId: number) => {
                        handleArchiveTicket(ticketId);
                    },
                }}
            />

        </div>
    )
}