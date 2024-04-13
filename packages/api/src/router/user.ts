import { z } from "zod";

import type { SQL } from "@ebichiri/db";
import type { ProfileEditData } from "@ebichiri/schema";
import { and, countDistinct, eq, like, not, or } from "@ebichiri/db";
import {
  DEFAULT_USER_NAME,
  follow,
  user as userDbSchema,
} from "@ebichiri/db/schema";
import { ProfileEditSchema } from "@ebichiri/schema";

import type { TRPCContext } from "../trpc";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { uploadImage } from "../utils";

export const userRouter = createTRPCRouter({
  getMine: protectedProcedure.query(({ ctx }) =>
    getUsersWithFollowsCount({
      ctx,
      where: eq(userDbSchema.id, ctx.user.id),
    }).then((rows) => {
      const result = rows[0];
      if (!result) return null;

      return {
        ...result.users,
        followersCount: result.followers?.count ?? 0,
        followingsCount: result.followings?.count ?? 0,
      };
    }),
  ),
  getOneById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      getUsersWithFollowsCount({
        ctx,
        where: eq(userDbSchema.id, ctx.user.id),
      }).then((rows) => {
        const result = rows[0];
        if (!result) return null;

        return {
          user: {
            ...result.users,
            followersCount: result.followers?.count ?? 0,
            followingsCount: result.followings?.count ?? 0,
          },
          isMe: ctx.user.id === input.id,
        };
      }),
    ),
  search: protectedProcedure
    .input(z.object({ searchText: z.string() }))
    .query(({ ctx, input }) =>
      input.searchText
        ? ctx.db
            .select()
            .from(userDbSchema)
            .where(
              and(
                not(eq(userDbSchema.name, DEFAULT_USER_NAME)),
                or(
                  like(userDbSchema.name, `%${input.searchText}%`),
                  like(userDbSchema.slug, `%${input.searchText}%`),
                ),
              ),
            )
            .orderBy(userDbSchema.name)
        : Promise.resolve([] as (typeof userDbSchema.$inferSelect)[]),
    ),
  create: protectedProcedure.mutation(({ ctx }) =>
    ctx.db
      .insert(userDbSchema)
      .values({ id: ctx.user.id, name: DEFAULT_USER_NAME }),
  ),
  update: protectedProcedure
    .input(ProfileEditSchema)
    .mutation(async ({ ctx, input }) => {
      const avatar = await getNewAvatar(ctx, input);

      return ctx.db
        .update(userDbSchema)
        .set({
          name: input.name,
          slug: input.slug,
          avatar,
          updatedAt: new Date(),
        })
        .where(eq(userDbSchema.id, ctx.user.id));
    }),
});

const getNewAvatar = (ctx: TRPCContext, input: ProfileEditData) =>
  input.avatarBase64
    ? uploadImage({
        ctx,
        path: `avatars/${ctx.user!.id}`,
        base64: input.avatarBase64 ?? "",
      })
        .then(({ uri }) => uri)
        .catch((e) => {
          console.log(e);
          return input.avatar;
        })
    : Promise.resolve(input.avatar);

const getUsersWithFollowsCount = ({
  ctx,
  where,
}: {
  ctx: TRPCContext;
  where?: SQL;
}) => {
  const followers = withFollowers(ctx);
  const followings = withFollowings(ctx);

  return ctx.db
    .with(followers, followings)
    .select()
    .from(userDbSchema)
    .leftJoin(followers, eq(followers.followingId, userDbSchema.id))
    .leftJoin(followings, eq(followings.userId, userDbSchema.id))
    .where(where);
};

const withFollowers = (ctx: TRPCContext) =>
  ctx.db.$with("followers").as(
    ctx.db
      .select({
        followingId: follow.followingId,
        count: countDistinct(follow.userId).as("followersCount"),
      })
      .from(follow)
      .groupBy(follow.followingId),
  );

const withFollowings = (ctx: TRPCContext) =>
  ctx.db.$with("followings").as(
    ctx.db
      .select({
        userId: follow.userId,
        count: countDistinct(follow.followingId).as("followingsCount"),
      })
      .from(follow)
      .groupBy(follow.userId),
  );
