import { Decimal } from "@prisma/client/runtime/library";

type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable };

export function serializeData<T>(input: T): Serializable {
  if (input === null || input === undefined) {
    return null;
  }

  if (typeof input === "string" || typeof input === "number" || typeof input === "boolean") {
    return input;
  }

  if (typeof input === "bigint") {
    return input.toString();
  }

  if (input instanceof Decimal) {
    return input.toString();
  }

  if (input instanceof Date) {
    return input.toISOString();
  }

  if (Array.isArray(input)) {
    return input.map((item) => serializeData(item));
  }

  if (typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, serializeData(value)])
    );
  }

  return null;
}

