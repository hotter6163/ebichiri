import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq, lt } from "@ebichiri/db";
import { photo, user } from "@ebichiri/db/schema";
import { LocationSchema } from "@ebichiri/types";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  getMineWithPagination: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullable().optional(),
        limit: z.number().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input: { cursor, limit: inputLimit } }) => {
      const where = cursor
        ? and(
            lt(photo.createdAt, new Date(cursor)),
            eq(photo.userId, ctx.user.id),
          )
        : eq(photo.userId, ctx.user.id);
      const limit = inputLimit ?? 3;

      const photos = await ctx.db
        .select()
        .from(photo)
        .where(where)
        .limit(limit + 1)
        .orderBy(desc(photo.createdAt));

      const items = photos.slice(0, limit);
      return {
        items,
        pagination: {
          cursor: items[items.length - 1]?.createdAt.toISOString() ?? null,
          hasNext: photos.length > limit,
        },
      };
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db
        .select()
        .from(photo)
        .leftJoin(user, eq(photo.userId, user.id))
        .where(eq(photo.id, input.id))
        .then((rows) =>
          rows[0]?.users
            ? (rows[0] as {
                photos: typeof photo.$inferSelect;
                users: typeof user.$inferSelect;
              })
            : null,
        ),
    ),
  create: protectedProcedure
    .input(
      z.object({
        base64: z.string(),
        location: LocationSchema.nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const blob = base64toBlob(input.base64);
      const { uri } = await ctx.storage.uploadImage("photos", blob);
      if (!uri) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return ctx.db.insert(photo).values({
        src: uri,
        location: input.location,
        userId: ctx.user.id,
      });
    }),
});

const base64toBlob = (base64: string) => {
  const bin = atob(base64.replace(/^.*,/, ""));
  const buffer = new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i));
  return new Blob([buffer.buffer], {
    type: "image/jpeg",
  });
};
