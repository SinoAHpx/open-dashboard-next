import type { ResourceHandlers } from "@/infra/data";
import type { SimpleUser } from "./types";

/**
 * Simple example that fetches from a static JSON file.
 * Demonstrates how to integrate with an API endpoint.
 */
export const simpleHandlers: ResourceHandlers<SimpleUser> = {
  list: async () => {
    const response = await fetch("/mocking/simple.json");
    if (!response.ok) {
      throw new Error("Failed to fetch simple users");
    }
    const data: SimpleUser[] = await response.json();
    return {
      data,
      total: data.length,
    };
  },
};
