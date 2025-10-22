import { Prisma } from "@prisma/client";
import { getResourceConfig } from "@/server/resources";

type ScalarFieldEnumRecord = Record<string, Record<string, string>>;

const scalarFieldEnumRecord = Prisma as unknown as ScalarFieldEnumRecord;

export function resolveResourceConfig(resource: string) {
  const config = getResourceConfig(resource);
  if (!config) {
    throw new Error(`Unknown resource: ${resource}`);
  }
  return config;
}

export function getScalarFields(model: Prisma.ModelName): string[] {
  const enumName = `${model}ScalarFieldEnum`;
  const scalarEnum = scalarFieldEnumRecord[enumName];
  if (!scalarEnum) {
    return [];
  }

  return Object.values(scalarEnum);
}

export function sanitizePayload(resourceKey: string, payload: Record<string, unknown>) {
  const config = resolveResourceConfig(resourceKey);
  const scalarFields = getScalarFields(config.model);
  const readOnly = new Set(config.readOnlyFields ?? []);

  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => {
      if (value === undefined) {
        return false;
      }
      if (!scalarFields.includes(key) || readOnly.has(key)) {
        return false;
      }
      return true;
    })
  );
}

export function normalizeId(value: string | number | bigint) {
  try {
    if (typeof value === "bigint") {
      return value;
    }

    if (typeof value === "number") {
      return BigInt(value);
    }

    if (typeof value === "string") {
      if (value === "") {
        throw new Error("Empty string id");
      }
      if (value.startsWith("0x") || value.startsWith("0X")) {
        return BigInt(value);
      }
      return BigInt(value);
    }
  } catch (error) {
    throw new Error(`Invalid resource id: ${String(value)}`);
  }

  throw new Error(`Unsupported id type: ${typeof value}`);
}

export function coerceScalarValues(entries: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [key, coerceValue(key, value)])
  );
}

export function coerceQueryValue(key: string, value: string) {
  return coerceValue(key, value);
}

function coerceValue(key: string, value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => coerceValue(key, item));
  }

  if (typeof value !== "string") {
    return value;
  }

  const lower = value.toLowerCase();
  if (lower === "true") {
    return true;
  }
  if (lower === "false") {
    return false;
  }
  if (lower === "null") {
    return null;
  }

  if (/^-?\d+$/.test(value)) {
    if (key === "id" || key.endsWith("Id")) {
      return normalizeId(value);
    }

    const asNumber = Number(value);
    return Number.isNaN(asNumber) ? value : asNumber;
  }

  if (/^-?\d+\.\d+$/.test(value)) {
    return value;
  }

  return value;
}
