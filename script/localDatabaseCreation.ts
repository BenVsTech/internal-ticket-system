// Imports

import { createLocalDatabase } from "@/lib/service/database.service";

// Run Script

(async () => {
    const result = await createLocalDatabase();
    if(result.status) {
        console.log('Local database created successfully');
    } else {
        console.error('Failed to create local database:', result.message);
    }
    process.exit(0);
})();