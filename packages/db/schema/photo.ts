import { relations, sql } from "drizzle-orm";
import { json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import type { Location } from "@ebichiri/types";

import { user } from "./user";

export const photo = pgTable("photos", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  src: varchar("src").notNull(),
  location: json("location").$type<Location>(),
  userId: uuid("user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { precision: 3, withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const photoRelations = relations(photo, ({ one }) => ({
  author: one(user, { fields: [photo.userId], references: [user.id] }),
}));
