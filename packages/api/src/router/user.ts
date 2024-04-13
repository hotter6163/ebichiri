import { z } from "zod";

import type { ProfileEditData } from "@ebichiri/schema";
import { and, eq, like, not, or } from "@ebichiri/db";
import { DEFAULT_USER_NAME, user as userDbSchema } from "@ebichiri/db/schema";
import { ProfileEditSchema } from "@ebichiri/schema";

import type { TRPCContext } from "../trpc";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { uploadImage } from "../utils";

export const userRouter = createTRPCRouter({
  getMine: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(userDbSchema)
      .where(eq(userDbSchema.id, ctx.user.id))
      .then((rows) => rows[0] as typeof userDbSchema.$inferSelect),
  ),
  getOneById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db
        .select()
        .from(userDbSchema)
        .where(eq(userDbSchema.id, input.id))
        .then((rows) => ({
          user: rows[0] as typeof userDbSchema.$inferSelect,
          isMe: ctx.user.id === input.id,
        })),
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
