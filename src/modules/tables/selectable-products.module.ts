import { createSelectableTableModule } from "@/modules/table-module";
import {
  selectableProductsConfig,
  createFloatingActionsConfig,
} from "@/lib/config/selectable-products.config";
import type { SelectableProduct } from "@/lib/api-wrapper/selectables";
import type { FloatingAction } from "@/components/FloatingActionMenu";

export interface FloatingActionsContext {
  selectedIds: string[];
  onClear: () => void;
  onRefresh: () => void;
  onEdit?: (id: string) => void;
}

export const selectableProductsModule = createSelectableTableModule<
  SelectableProduct,
  void,
  FloatingActionsContext
>({
  id: "selectable-products-table",
  meta: {
    title: "Selectable Products",
    description: "Select multiple products to perform bulk operations.",
  },
  createConfig: () => selectableProductsConfig,
  createFloatingActions: (context): FloatingAction[] =>
    createFloatingActionsConfig(context),
});
