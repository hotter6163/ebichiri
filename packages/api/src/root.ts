import { followRouter } from "./router/follow";
import { photoRouter } from "./router/photo";
import { sessionRouter } from "./router/session";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  follow: followRouter,
  photo: photoRouter,
  session: sessionRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
