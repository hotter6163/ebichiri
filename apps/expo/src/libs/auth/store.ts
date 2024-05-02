import { Store } from "@/utils/store";

export const SessionStore = new Store<string>("auth.token", {
  from: (value: string) => value,
  to: (value: string) => value,
});
