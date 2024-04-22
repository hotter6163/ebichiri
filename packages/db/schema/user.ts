import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { follow } from "./follow";
import { photo } from "./photo";
import { session } from "./session";

export const DEFAULT_USER_NAME = "新規ユーザー";

export const user = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
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

export const userRelations = relations(user, ({ one, many }) => ({
  following: many(follow),
  followers: many(follow),
  photos: many(photo),
  session: one(session, { fields: [user.id], references: [session.userId] }),
}));
