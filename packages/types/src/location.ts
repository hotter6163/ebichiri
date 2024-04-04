import { z } from "zod";

export const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().nullable(),
  accuracy: z.number().nullable(),
  altitudeAccuracy: z.number().nullable(),
  heading: z.number().nullable(),
  speed: z.number().nullable(),
});

export type Location = z.infer<typeof LocationSchema>;
