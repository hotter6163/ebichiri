import * as SecureStore from "expo-secure-store";

interface Converter<T> {
  from: (value: string) => T | Promise<T>;
  to: (value: T) => string;
}

export class Storage<T> {
  constructor(
    private key: string,
    private convertor: Converter<T>,
  ) {}

  async get(): Promise<T | null> {
    const value = await SecureStore.getItemAsync(this.key);
    return typeof value === "string" ? this.convertor.from(value) : value;
  }

  async set(value: T): Promise<void> {
    const stringValue = this.convertor.to(value);
    await SecureStore.setItemAsync(this.key, stringValue);
  }
}
