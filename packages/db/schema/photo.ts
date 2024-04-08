import { relations, sql } from "drizzle-orm";
import {
  doublePrecision,
  json,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import type { Location } from "@ebichiri/schema";

import { user } from "./user";

export const photo = pgTable("photos", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  src: varchar("src").notNull(),
  longitude: doublePrecision("longitude"),
  latitude: doublePrecision("latitude"),
  area: varchar("area", { length: 256 }).notNull(),
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
