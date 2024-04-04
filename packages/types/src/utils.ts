export type NonNullableObject<T extends object, U extends keyof T> = {
  [P in keyof T]: P extends U ? NonNullable<T[P]> : T[P];
};
