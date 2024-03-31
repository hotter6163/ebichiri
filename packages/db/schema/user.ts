import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  image: varchar("image"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});