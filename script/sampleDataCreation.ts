// Imports

import { createSampleTickets } from "@/lib/service/database.service";

// Run Script

(async () => {
    const result = await createSampleTickets();
    console.log(result.message);
    process.exit(0);
})();