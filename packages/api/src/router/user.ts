import { eq } from "@ebichiri/db";
import { user as userDbSchema } from "@ebichiri/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getMine: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(userDbSchema)
      .where(eq(userDbSchema.id, ctx.user.id))
      .then((rows) => convertUser(rows[0] as typeof userDbSchema.$inferSelect)),
  ),
  create: protectedProcedure.mutation(({ ctx }) =>
    ctx.db.insert(userDbSchema).values({ id: ctx.user.id }),
  ),
});

const convertUser = (user: typeof userDbSchema.$inferSelect) => ({
  ...user,
  name: user.name || "匿名ユーザー",
});
