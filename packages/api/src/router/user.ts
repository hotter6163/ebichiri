import { eq } from "@ebichiri/db";
import { user as userDbSchema } from "@ebichiri/db/schema";
import { ProfileEditData, ProfileEditSchema } from "@ebichiri/schema";

import { createTRPCRouter, protectedProcedure, TRPCContext } from "../trpc";
import { uploadImage } from "../utils";

export const userRouter = createTRPCRouter({
  getMine: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(userDbSchema)
      .where(eq(userDbSchema.id, ctx.user.id))
      .then((rows) => rows[0] as typeof userDbSchema.$inferSelect),
  ),
  create: protectedProcedure.mutation(({ ctx }) =>
    ctx.db
      .insert(userDbSchema)
      .values({ id: ctx.user.id, name: "新規ユーザー" }),
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
