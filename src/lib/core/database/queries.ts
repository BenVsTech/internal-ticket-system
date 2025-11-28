// Imports

import { DataReturnObject } from "@/types/helper";
import { DatabaseClient } from "../database";
import { DatabaseConfiguration, DatabaseTable } from "@/types/database";

// Exports

export async function checkIfDatabaseExists(client: DatabaseClient, databaseName: string): Promise<DataReturnObject<boolean>> {
    try{

        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [databaseName]
        );

        const databaseExists = result.rows.length > 0;

        return {
            status: true,
            data: databaseExists,
            message: 'Database exists'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while checking if database exists'
        };
    }
}

export async function createDatabase(client: DatabaseClient, databaseName: string): Promise<DataReturnObject<boolean>> {
    try{

        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(databaseName)) {
            return {
                status: false,
                data: null,
                message: 'Invalid database name format'
            };
        }

        await client.query(`CREATE DATABASE ${databaseName}`);

        return {
            status: true,
            data: true,
            message: `Database '${databaseName}' created successfully`
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating database'
        };
    }
}

export async function createGlobalTriggerFunctions(client: DatabaseClient, globalTriggerFunctions: string[]): Promise<DataReturnObject<boolean>> {
    try{

        for (const functionSQL of globalTriggerFunctions) {
            await client.query(functionSQL);
        }

        return {
            status: true,
            data: true,
            message: 'Global trigger functions created successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating global trigger functions'
        };
    }
}

export async function createTable(client: DatabaseClient, table: DatabaseTable): Promise<DataReturnObject<boolean>> {
    try{

        const columnDefinitions = table.columns.map(col => `${col.name} ${col.type}`).join(', ');

        let createTableSQL = `CREATE TABLE IF NOT EXISTS ${table.name} (${columnDefinitions}`;

        if (table.foreignKeys && table.foreignKeys.trim()) {
            createTableSQL += `, ${table.foreignKeys.trim()}`;
        }

        if (table.uniqueConstraints && table.uniqueConstraints.trim()) {
            createTableSQL += `, ${table.uniqueConstraints.trim()}`;
        }

        createTableSQL += ')';

        await client.query(createTableSQL);

        if (table.useUpdatedAtTrigger) {
            const triggerName = `trigger_update_${table.name}_updated_at`;
            await client.query(`
                DROP TRIGGER IF EXISTS ${triggerName} ON ${table.name};
                CREATE TRIGGER ${triggerName}
                BEFORE UPDATE ON ${table.name}
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            `);
        }

        if (table.usePasswordEncryptionTrigger) {
            const triggerName = `trigger_encrypt_${table.name}_password`;
            await client.query(`
                DROP TRIGGER IF EXISTS ${triggerName} ON ${table.name};
                CREATE TRIGGER ${triggerName}
                BEFORE INSERT OR UPDATE ON ${table.name}
                FOR EACH ROW
                EXECUTE FUNCTION encrypt_password_before_insert();
            `);
        }

        return {
            status: true,
            data: true,
            message: `Table '${table.name}' created successfully`
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : `Unknown error while creating table '${table.name}'`
        };
    }
}

export async function createDatabaseSchema(client: DatabaseClient, config: DatabaseConfiguration): Promise<DataReturnObject<boolean>> {
    try{

        const functionsResult = await createGlobalTriggerFunctions(client, config.globalTriggerFunctions);
        if (!functionsResult.status) {
            return functionsResult;
        }

        for (const table of config.tables) {
            const tableResult = await createTable(client, table);
            if (!tableResult.status) {
                return tableResult;
            }
        }

        return {
            status: true,
            data: true,
            message: 'Database schema created successfully'
        };

    } catch(error: unknown) {
        return {
            status: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error while creating database schema'
        };
    }
}
