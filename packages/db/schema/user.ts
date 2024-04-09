import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { photo } from "./photo";

export const DEFAULT_USER_NAME = "新規ユーザー";

export const user = pgTable("users", {
  id: uuid("id").primaryKey(),
  slug: varchar("slug", { length: 256 })
    .unique()
    .notNull()
    .default(sql`encode(gen_random_bytes(6), 'base64')::text`),
  name: varchar("name", { length: 256 }).notNull().default(DEFAULT_USER_NAME),
  avatar: varchar("image"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  photos: many(photo),
}));
