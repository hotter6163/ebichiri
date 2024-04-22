import { TRPCClientError } from "@trpc/client";

import {
  session as sessionDbSchema,
  user as userDbSchema,
} from "@ebichiri/db/schema";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const sessionRouter = createTRPCRouter({
  create: publicProcedure.mutation(async ({ ctx }) => {
    const [user] = await ctx.db.insert(userDbSchema).values({}).returning();
    if (!user) throw new TRPCClientError("Failed to create user");

    const [session] = await ctx.db
      .insert(sessionDbSchema)
      .values({ userId: user.id })
      .returning();
    if (!session) throw new TRPCClientError("Failed to create session");

    return session;
  }),
});
