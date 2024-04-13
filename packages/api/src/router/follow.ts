import { z } from "zod";

import { and, count, eq } from "@ebichiri/db";
import { follow } from "@ebichiri/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const followRouter = createTRPCRouter({
  isFollowing: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db
        .select({ value: count() })
        .from(follow)
        .where(
          and(
            eq(follow.userId, ctx.user.id),
            eq(follow.followingId, input.userId),
          ),
        )
        .then((row) => row[0] && row[0].value > 0),
    ),
  follow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .insert(follow)
        .values({ userId: ctx.user.id, followingId: input.userId }),
    ),
  unfollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .delete(follow)
        .where(
          and(
            eq(follow.userId, ctx.user.id),
            eq(follow.followingId, input.userId),
          ),
        ),
    ),
});
