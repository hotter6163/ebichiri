import { Storage } from "@/utils/storage";

const STORAGE_KEY = "session.token";

export const AuthTokenStorage = new Storage<string>(STORAGE_KEY, {
  from: (value) => value,
  to: (value) => value,
});
