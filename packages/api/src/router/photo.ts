import { z } from "zod";

import type { Location, NonNullableObject, Region } from "@ebichiri/schema";
import { and, desc, eq, gt, lt } from "@ebichiri/db";
import { photo, user } from "@ebichiri/db/schema";
import { getReverseGeocoding, PlaceType2 } from "@ebichiri/google";
import { LocationSchema, RegionSchema } from "@ebichiri/schema";

import type { TRPCContext } from "../trpc";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { uploadImage } from "../utils";

const PaginationSchema = z.object({
  cursor: z.string().nullable().optional(),
  limit: z.number().nullable().optional(),
});

export const photoRouter = createTRPCRouter({
  getMineWithPagination: protectedProcedure
    .input(PaginationSchema)
    .query(async ({ ctx, input }) =>
      getManyWithPaginationByUserId({
        ctx,
        input: { ...input, userId: ctx.user.id },
      }),
    ),
  getManyWithPaginationByUserId: protectedProcedure
    .input(
      PaginationSchema.merge(
        z.object({
          userId: z.string(),
        }),
      ),
    )
    .query(async ({ ctx, input }) =>
      getManyWithPaginationByUserId({
        ctx,
        input,
      }),
    ),
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
    .query(async ({ ctx, input: { region } }) =>
      getPhotosInRegion({ ctx, region, userId: ctx.user.id }),
    ),
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
      console.log("uri", uri);
      const photos = await getPhotosInRegion({
        ctx,
        region: locationToRegion(input.location),
      });
      console.log("photos", photos.length);
      const area = await (photos.length
        ? getAreaFromPhots(photos)
        : getAreaFromReverseGeocoding(input.location!));

      return ctx.db.insert(photo).values({
        src: uri,
        longitude: input.location?.longitude,
        latitude: input.location?.latitude,
        area,
        location: input.location,
        userId: ctx.user.id,
      });
    }),
});

const locationToRegion = (location: Location | null) => {
  if (!location) return null;
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.02 / 111,
    longitudeDelta:
      0.02 / (111 * Math.cos(location.latitude * (Math.PI / 180))),
  };
};

const getManyWithPaginationByUserId = async ({
  ctx,
  input: { cursor, limit: inputLimit, userId },
}: {
  ctx: TRPCContext;
  input: z.infer<typeof PaginationSchema> & { userId: string };
}) => {
  const where = cursor
    ? and(lt(photo.createdAt, new Date(cursor)), eq(photo.userId, userId))
    : eq(photo.userId, userId);
  const limit = inputLimit ?? 30;

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
};

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

type PhotoWithLocation = NonNullableObject<
  typeof photo.$inferSelect,
  "longitude" | "latitude"
>;

const getPhotosInRegion = async ({
  ctx,
  region,
  userId,
}: {
  ctx: TRPCContext;
  region: Region | null;
  userId?: string;
}): Promise<
  NonNullableObject<typeof photo.$inferSelect, "longitude" | "latitude">[]
> => {
  if (!region) return Promise.resolve([]);

  const bounds = calculateRegionBounds(region);
  const geographyWhere = and(
    gt(photo.longitude, bounds.x.min),
    lt(photo.longitude, bounds.x.max),
    gt(photo.latitude, bounds.y.min),
    lt(photo.latitude, bounds.y.max),
  );
  const where = userId
    ? and(geographyWhere, eq(photo.userId, userId))
    : geographyWhere;
  const photos = await ctx.db.select().from(photo).where(where);
  return photos as PhotoWithLocation[];
};

const getAreaFromReverseGeocoding = async (location: {
  longitude: number;
  latitude: number;
}) => {
  const { results } = await getReverseGeocoding({
    location,
  });
  const addressComponents = results.flatMap(
    (result) => result.address_components,
  );
  const province =
    addressComponents.find(
      (component) =>
        component.types.includes(PlaceType2.political) &&
        component.types.includes(PlaceType2.administrative_area_level_1),
    )?.long_name ?? "";
  const city =
    addressComponents.find(
      (component) =>
        component.types.includes(PlaceType2.locality) &&
        component.types.includes(PlaceType2.political),
    )?.long_name ?? "";
  return `${province}${city}`;
};

const getAreaFromPhots = (photos: PhotoWithLocation[]) => {
  const areasCount = photos.reduce(
    (acc, photo) => ({
      ...acc,
      [photo.area]: (acc[photo.area] ?? 0) + 1,
    }),
    {} as Record<string, number>,
  );
  const { key } = Object.entries(areasCount).reduce(
    (acc, [key, value]) => (value > acc.value ? { key, value } : acc),
    { key: "", value: 0 },
  );
  return key;
};
