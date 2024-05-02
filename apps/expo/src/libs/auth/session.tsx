import type { FC } from "react";
import { useEffect } from "react";
import { api } from "@/libs/trpc/api";

import { SessionStore } from "./store";

export const SessionHandler: FC = () => {
  const { mutateAsync } = api.session.create.useMutation({
    onSuccess: (session) => SessionStore.set(session.accessToken),
  });

  useEffect(() => {
    void sessionStore.get().then(async (token) => {
      if (!token) await mutateAsync();
    });
  }, [mutateAsync]);

  return null;
};
