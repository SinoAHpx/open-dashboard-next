import type { ResourceHandlers } from "@/infra/data";

/**
 * Central registry mapping resource names to their handlers.
 * Examples and features register their handlers here.
 */
export const resourceRegistry: Record<string, ResourceHandlers> = {};

/**
 * Register handlers for a resource
 */
export function registerResource(
  name: string,
  handlers: ResourceHandlers,
): void {
  resourceRegistry[name] = handlers;
}

/**
 * Get handlers for a resource
 */
export function getResourceHandlers(
  name: string,
): ResourceHandlers | undefined {
  return resourceRegistry[name];
}
