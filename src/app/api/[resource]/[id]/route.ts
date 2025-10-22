import { NextRequest, NextResponse } from "next/server";
import { resourceKeys } from "@/server/resources";
import {
  coerceScalarValues,
  resolveResourceConfig,
  sanitizePayload,
  normalizeId,
} from "@/server/utils/resource-helpers";
import { getModelClient } from "@/server/utils/model-client";
import { serializeData } from "@/server/utils/serialization";

type ContextParams = {
  params: Promise<{ resource: string; id: string }>;
};

export async function GET(_request: NextRequest, { params }: ContextParams) {
  const { resource, id: idParam } = await params;

  if (!resourceKeys.includes(resource as (typeof resourceKeys)[number])) {
    return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 404 });
  }

  try {
    const id = normalizeId(idParam);
    const config = resolveResourceConfig(resource);
    const modelClient = getModelClient(config.model);

    const item = await modelClient.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json(serializeData(item));
  } catch (error) {
    console.error(`Resource ${resource} GET/${idParam} error`, error);
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: ContextParams) {
  const { resource, id: idParam } = await params;

  if (!resourceKeys.includes(resource as (typeof resourceKeys)[number])) {
    return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 404 });
  }

  try {
    const id = normalizeId(idParam);
    const payload = (await request.json()) as Record<string, unknown>;
    const sanitized = sanitizePayload(resource, payload);
    const coerced = coerceScalarValues(sanitized);

    const config = resolveResourceConfig(resource);
    const modelClient = getModelClient(config.model);

    const updated = await modelClient.update({
      where: { id },
      data: coerced,
    });

    return NextResponse.json(serializeData(updated));
  } catch (error: unknown) {
    console.error(`Resource ${resource} PATCH/${idParam} error`, error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: ContextParams) {
  const { resource, id: idParam } = await params;

  if (!resourceKeys.includes(resource as (typeof resourceKeys)[number])) {
    return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 404 });
  }

  try {
    const id = normalizeId(idParam);
    const config = resolveResourceConfig(resource);
    const modelClient = getModelClient(config.model);

    await modelClient.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Resource ${resource} DELETE/${idParam} error`, error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}

