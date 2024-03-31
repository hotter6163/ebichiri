import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const profile = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  image: varchar("image", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
