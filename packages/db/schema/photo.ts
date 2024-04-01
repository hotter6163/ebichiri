import { relations, sql } from "drizzle-orm";
import { json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { user } from "./user";

interface Location {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export const photo = pgTable("photos", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  src: varchar("src").notNull(),
  location: json("location").$type<Location>(),
  userId: uuid("user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const photoRelations = relations(photo, ({ one }) => ({
  author: one(user, { fields: [photo.userId], references: [user.id] }),
}));
