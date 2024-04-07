import { TRPCError } from "@trpc/server";

import type { createTRPCContext } from "./trpc";

export const uploadImage = async ({
  ctx,
  path,
  base64,
}: {
  ctx: Awaited<ReturnType<typeof createTRPCContext>>;
  path: string;
  base64: string;
}) => {
  const blob = base64ToBlob(base64);
  const { uri } = await ctx.storage.uploadImage(path, blob);
  if (!uri) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  return { uri };
};

const base64ToBlob = (base64: string) => {
  const bin = atob(base64.replace(/^.*,/, ""));
  const buffer = new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i));
  return new Blob([buffer.buffer], {
    type: "image/jpeg",
  });
};
