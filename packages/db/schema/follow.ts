import { relations, sql } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./user";

export const follow = pgTable(
  "follows",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.followingId] }),
    pkWithCustomName: primaryKey({
      name: "follows_pk",
      columns: [table.userId, table.followingId],
    }),
  }),
);

export const followRelations = relations(follow, ({ one }) => ({
  user: one(user, { fields: [follow.userId], references: [user.id] }),
  following: one(user, { fields: [follow.followingId], references: [user.id] }),
}));
