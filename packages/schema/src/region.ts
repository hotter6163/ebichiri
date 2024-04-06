import { z } from "zod";

export const RegionSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  latitudeDelta: z.number(),
  longitudeDelta: z.number(),
});

export type Region = z.infer<typeof RegionSchema>;
