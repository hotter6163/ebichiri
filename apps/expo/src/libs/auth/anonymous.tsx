import type { FC } from "react";
import { useEffect } from "react";
import { api } from "@/utils/api";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const AnonymousSignIn: FC = () => {
  const context = useSessionContext();
  const { mutateAsync } = api.user.create.useMutation();

  useEffect(() => {
    const { isLoading, error, session, supabaseClient } = context;
    if (isLoading || !!error || !!session) return;
    void supabaseClient.auth.signInAnonymously().then(() => mutateAsync());
  }, [context, mutateAsync]);

  return null;
};
