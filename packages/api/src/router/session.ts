import { TRPCClientError } from "@trpc/client";

import { eq } from "@ebichiri/db";
import {
  session as sessionDbSchema,
  user as userDbSchema,
} from "@ebichiri/db/schema";

import type { TRPCContext } from "../trpc";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const sessionRouter = createTRPCRouter({
  create: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.user) return getSession({ ...ctx, user: ctx.user });

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

const getSession = (
  ctx: Omit<TRPCContext, "user"> & {
    user: NonNullable<TRPCContext["user"]>;
  },
) =>
  ctx.db
    .select()
    .from(sessionDbSchema)
    .where(eq(sessionDbSchema.userId, ctx.user.id))
    .limit(1)
    .then((sessions) => {
      if (!sessions[0]) throw new TRPCClientError("Session not found");
      return sessions[0];
    });
