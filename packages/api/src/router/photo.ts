import { z } from "zod";

import type { NonNullableObject, Region } from "@ebichiri/schema";
import { and, desc, eq, gt, lt } from "@ebichiri/db";
import { photo, user } from "@ebichiri/db/schema";
import { LocationSchema, RegionSchema } from "@ebichiri/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { uploadImage } from "../utils";

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
  getManyInRegion: protectedProcedure
    .input(
      z.object({
        region: RegionSchema,
      }),
    )
    .query(async ({ ctx, input: { region } }) => {
      const bounds = calculateRegionBounds(region);
      const photos = await ctx.db
        .select()
        .from(photo)
        .where(
          and(
            eq(photo.userId, ctx.user.id),
            and(
              gt(photo.longitude, bounds.x.min),
              lt(photo.longitude, bounds.x.max),
              gt(photo.latitude, bounds.y.min),
              lt(photo.latitude, bounds.y.max),
            ),
          ),
        );
      return photos as NonNullableObject<
        typeof photo.$inferSelect,
        "longitude" | "latitude"
      >[];
    }),
  create: protectedProcedure
    .input(
      z.object({
        base64: z.string(),
        location: LocationSchema.nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { uri } = await uploadImage({
        ctx,
        path: "photos",
        base64: input.base64,
      });

      return ctx.db.insert(photo).values({
        src: uri,
        longitude: input.location?.longitude,
        latitude: input.location?.latitude,
        location: input.location,
        userId: ctx.user.id,
      });
    }),
});

const calculateRegionBounds = (region: Region) => ({
  x: {
    min: region.longitude - region.longitudeDelta / 2,
    max: region.longitude + region.longitudeDelta / 2,
  },
  y: {
    min: region.latitude - region.latitudeDelta / 2,
    max: region.latitude + region.latitudeDelta / 2,
  },
});
