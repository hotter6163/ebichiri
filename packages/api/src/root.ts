import { profileRouter } from "./router/profile";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
