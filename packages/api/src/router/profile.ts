import { z } from "zod";

import { profile } from "@ebichiri/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(z.object({ name: z.string().min(1), image: z.string().nullable() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(profile)
        .values({ id: ctx.user.id, ...input })
        .onConflictDoUpdate({ target: profile.id, set: input }),
    ),
});
