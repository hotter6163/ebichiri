import { z } from "zod";

import { user } from "@ebichiri/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(z.object({ name: z.string().min(1), image: z.string().nullable() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(user)
        .values({ id: ctx.user.id, ...input })
        .onConflictDoUpdate({ target: [user.id], set: input }),
    ),
});
