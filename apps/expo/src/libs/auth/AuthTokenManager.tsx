import type { FC } from "react";
import { useEffect } from "react";
import { api } from "@/utils/api";

import { AuthTokenStorage } from "./AuthTokenStorage";

export const AuthTokenManager: FC = () => {
  const { mutateAsync } = api.session.create.useMutation({
    onSuccess: (session) => AuthTokenStorage.set(session.accessToken),
  });

  useEffect(() => {
    void AuthTokenStorage.get().then((token) => {
      if (!token) return mutateAsync();
    });
  }, [mutateAsync]);

  return null;
};
