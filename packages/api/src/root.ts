import { photoRouter } from "./router/photo";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  photo: photoRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
