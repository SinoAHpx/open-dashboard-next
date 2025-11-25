import { registerResource } from "@/infra/refine";
import { productsHandlers } from "./products";
import { selectablesHandlers } from "./selectables";
import { simpleHandlers } from "./simple";
import { tasksHandlers } from "./tasks";
import { usersHandlers } from "./users";

/**
 * Register all example resource handlers.
 * Call this once at app startup (e.g., in providers.tsx).
 */
export function registerExampleResources(): void {
  registerResource("users", usersHandlers);
  registerResource("products", productsHandlers);
  registerResource("tasks", tasksHandlers);
  registerResource("selectables", selectablesHandlers);
  registerResource("simple-table", simpleHandlers);
}
