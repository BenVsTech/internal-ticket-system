// Exporting Types

export interface Section {
    settings: boolean;
    tickets: boolean;
    teams: boolean;
    admin: boolean;
}

export interface SettingsProps {
    setup: {
        onClose: () => void;
    }
}

export interface TicketsProps {
    setup: {
        title: string;
        description: string;
        userId: number;
        isPersonalTickets: boolean;
    }
}

export interface TableProps {
    setup: {
        headers: string[];
        data: string[][];
        clickable: boolean;
        onClick: (id: number) => void;
    }
}

export interface TicketComponent {
    id: number;
    title: string;
    description: string;
    status: string;
    created: {
        id: number;
        name: string;
    };
    assignedTo: {
        id: number;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}