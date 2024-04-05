import type { FC } from "react";
import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const AnonymousSignIn: FC = () => {
  const context = useSessionContext();

  useEffect(() => {
    const { isLoading, error, session, supabaseClient } = context;
    console.log(isLoading, !!error, !!session);
    if (isLoading || !!error || !!session) return;
    void supabaseClient.auth.signInAnonymously();
  }, [context]);

  return null;
};
