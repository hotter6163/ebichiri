import { user } from "@ebichiri/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  create: protectedProcedure.mutation(({ ctx }) =>
    ctx.db.insert(user).values({ id: ctx.user.id }),
  ),
});
