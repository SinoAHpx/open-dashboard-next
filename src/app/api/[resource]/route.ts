import { NextRequest, NextResponse } from "next/server";
import { resourceKeys } from "@/server/resources";
import {
  coerceQueryValue,
  coerceScalarValues,
  getScalarFields,
  resolveResourceConfig,
  sanitizePayload,
} from "@/server/utils/resource-helpers";
import { serializeData } from "@/server/utils/serialization";
import { getModelClient } from "@/server/utils/model-client";

const RESERVED_QUERY_KEYS = new Set(["page", "pageSize", "search", "sortBy", "sortOrder"]);

type ContextParams = {
  params: Promise<{ resource: string }>;
};

function buildOrderBy(
  sortBy: string | null,
  sortOrder: "asc" | "desc",
  scalarFields: string[],
  fallback?: Record<string, "asc" | "desc">
) {
  if (sortBy && scalarFields.includes(sortBy)) {
    return { [sortBy]: sortOrder };
  }

  if (fallback && Object.keys(fallback).length > 0) {
    return fallback;
  }

  return { id: "desc" };
}

function buildWhere(searchParams: URLSearchParams, resource: string, scalarFields: string[], searchFields?: string[]) {
  const where: Record<string, unknown> = {};
  const search = searchParams.get("search");

  if (search && searchFields && searchFields.length > 0) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    }));
  }

  const processedKeys = new Set<string>();

  searchParams.forEach((_value, key) => {
    if (RESERVED_QUERY_KEYS.has(key)) {
      return;
    }
    processedKeys.add(key);
  });

  for (const key of processedKeys) {
    if (!scalarFields.includes(key)) {
      continue;
    }

    const values = searchParams.getAll(key);

    if (values.length === 1) {
      where[key] = coerceQueryValue(key, values[0]!);
    } else if (values.length > 1) {
      where[key] = { in: values.map((value) => coerceQueryValue(key, value)) };
    }
  }

  return where;
}

export async function GET(request: NextRequest, { params }: ContextParams) {
  const { resource } = await params;

  if (!resourceKeys.includes(resource as (typeof resourceKeys)[number])) {
    return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 404 });
  }

  try {
    const config = resolveResourceConfig(resource);
    const scalarFields = getScalarFields(config.model);
    const modelClient = getModelClient(config.model);
    const searchParams = request.nextUrl.searchParams;

    const page = Math.max(Number.parseInt(searchParams.get("page") ?? "1", 10), 1);
    const pageSizeRaw = Number.parseInt(searchParams.get("pageSize") ?? "20", 10);
    const pageSize = Math.max(1, Math.min(pageSizeRaw, 100));
    const sortBy = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");
    const sortOrder: "asc" | "desc" = sortOrderParam === "desc" ? "desc" : "asc";

    const where = buildWhere(searchParams, resource, scalarFields, config.searchFields);
    const orderBy = buildOrderBy(sortBy, sortOrder, scalarFields, config.defaultOrderBy);

    const skip = (page - 1) * pageSize;

    const [data, totalCount] = await Promise.all([
      modelClient.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
      }),
      modelClient.count({
        where,
      }),
    ]);

    const serialized = serializeData(data);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return NextResponse.json({
      data: serialized,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error(`Collection ${resource} GET error`, error);
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: ContextParams) {
  const { resource } = await params;

  if (!resourceKeys.includes(resource as (typeof resourceKeys)[number])) {
    return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 404 });
  }

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const sanitized = sanitizePayload(resource, payload);
    const coerced = coerceScalarValues(sanitized);

    const config = resolveResourceConfig(resource);
    const modelClient = getModelClient(config.model);

    const created = await modelClient.create({
      data: coerced,
    });

    return NextResponse.json(serializeData(created), { status: 201 });
  } catch (error) {
    console.error(`Collection ${resource} POST error`, error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
