import { createTRPCClient, httpLink, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";

import { appRouter } from "@ebichiri/api";

export const api = createTRPCClient<typeof appRouter>({
  links: [
    httpLink({
      transformer: SuperJSON,
      url: "/api/trpc",
      headers: async () => {
        const heads = new Headers();
        heads.set("x-trpc-source", "nextjs");
        return Object.fromEntries(heads);
      },
    }),
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
  ],
});
