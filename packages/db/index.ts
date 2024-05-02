import { createClient } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

export { schema };

export * from "drizzle-orm";

const client = createClient();
export const db = drizzle(client, { schema });
