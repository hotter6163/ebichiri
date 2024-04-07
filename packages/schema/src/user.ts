import { z } from "zod";

export const ProfileEditSchema = z.object({
  name: z.string().min(1).max(256),
  slug: z.string().min(1).max(256),
  avatar: z.union([z.string().url(), z.literal(null)]),
  avatarBase64: z.string().optional(),
});

export type ProfileEditData = z.infer<typeof ProfileEditSchema>;
