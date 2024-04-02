import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq, lt } from "@ebichiri/db";
import { photo } from "@ebichiri/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        base64: z.string(),
        location: z
          .object({
            latitude: z.number(),
            longitude: z.number(),
            altitude: z.number().nullable(),
            accuracy: z.number().nullable(),
            altitudeAccuracy: z.number().nullable(),
            heading: z.number().nullable(),
            speed: z.number().nullable(),
          })
          .nullable(),
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
});

const base64toBlob = (base64: string) => {
  const bin = atob(base64.replace(/^.*,/, ""));
  const buffer = new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i));
  return new Blob([buffer.buffer], {
    type: "image/jpeg",
  });
};
