// Exporting Constants

export const databaseConstants = {
    defaultTimestamp: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    primaryKey: 'SERIAL PRIMARY KEY',
    varchar: (length: number) => `VARCHAR(${length})`,
    integer: 'INTEGER NOT NULL',
    interval: 'INTERVAL',
    date: 'DATE',
    decimal: (precision: number, scale: number) => `DECIMAL(${precision}, ${scale})`,
    boolean: 'BOOLEAN NOT NULL DEFAULT FALSE',
    json: 'JSONB NOT NULL',
}

export const testUser = {
    team: {
        name: 'Test Team',
        description: 'This is a test team',
    },
    user: {
        name: 'Test User',
        email: 'test@test.com',
        password: 'test',
    },
}

export const sampleTickets = [
    {
        title: 'Sample Ticket 1',
        description: 'This is a sample ticket',
        status: 'open',
        createdByUserId: 1,
        assignedToUserId: 1,
    },
    {
        title: 'Sample Ticket 2',
        description: 'This is a sample ticket',
        status: 'open',
        createdByUserId: 1,
        assignedToUserId: 1,
    },
    {
        title: 'Sample Ticket 3',
        description: 'This is a sample ticket',
        status: 'open',
        createdByUserId: 1,
        assignedToUserId: 1,
    },
]
