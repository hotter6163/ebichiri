import type { FC } from "react";
import { useEffect } from "react";
import { api } from "@/utils/api";
import { Store } from "@/utils/store";

export const sessionStore = new Store<string>("auth.token", {
  from: (value: string) => value,
  to: (value: string) => value,
});

export const SessionHandler: FC = () => {
  const { mutateAsync } = api.session.create.useMutation({
    onSuccess: (session) => sessionStore.set(session.accessToken),
  });

  useEffect(() => {
    void sessionStore.get().then(async (token) => {
      if (!token) await mutateAsync();
    });
  }, [mutateAsync]);

  return null;
};
