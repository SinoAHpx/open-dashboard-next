import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ModelClient = {
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown | null>;
  count: (args: Record<string, unknown>) => Promise<number>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
};

function lowerFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

export function getModelClient(model: Prisma.ModelName): ModelClient {
  const clientKey = lowerFirst(model);
  const modelClient = (prisma as any)[clientKey];

  if (!modelClient) {
    throw new Error(`Unable to resolve Prisma model client for ${model}`);
  }

  return modelClient as ModelClient;
}

