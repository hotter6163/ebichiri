import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db, eq } from "@ebichiri/db";
import {
  session as sessionDbSchema,
  user as userDbSchema,
} from "@ebichiri/db/schema";
import { Storage } from "@ebichiri/storage";

export const createTRPCContext = async (opts: { request: Request }) => {
  const token = opts.request.headers.get("authorization");
  const user = token
    ? await db
        .select()
        .from(userDbSchema)
        .innerJoin(sessionDbSchema, eq(sessionDbSchema.userId, userDbSchema.id))
        .where(eq(sessionDbSchema.accessToken, token))
        .limit(1)
        .then((rows) => rows[0]?.users)
    : null;

  const path = new URL(opts.request.url).pathname.replace("/api/trpc/", "");
  const source = opts.request.headers.get("x-trpc-source") ?? "unknown";
  console.info(">>> tRPC Request", {
    path,
    source,
    user: user?.id,
  });

  return {
    user: user ?? null,
    db,
    storage: new Storage(),
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
