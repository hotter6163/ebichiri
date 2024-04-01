import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
});

const base64toBlob = (base64: string) => {
  const bin = atob(base64.replace(/^.*,/, ""));
  const buffer = new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i));
  return new Blob([buffer.buffer], {
    type: "image/jpeg",
  });
};
