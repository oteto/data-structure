export type Nullable<T> = T | null;

export const nonNullable = <T>(nullable: Nullable<T>): T => {
  if (nullable === null) {
    throw new Error(`value is null. value: ${nullable}`);
  }
  return nullable;
};
