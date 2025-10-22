import { Chip } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PaginationTableBlueprint,
  type PaginationRequest,
  type PaginationResponse,
  type PaginationTableConfig,
} from "@/lib/config/table-blueprint";
import { getPets, type PetRecord } from "@/lib/api-wrapper/pets";

function formatNumber(value: string | null, suffix = "") {
  if (!value) return "—";
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return `${numeric.toFixed(2)}${suffix}`;
}

async function fetchPets(
  params: PaginationRequest
): Promise<PaginationResponse<PetRecord>> {
  const { page, pageSize, search, sortBy, sortOrder, ...rest } = params;
  const filters = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => value !== undefined && value !== "")
  );

  const response = await getPets({
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    filters,
  });

  return {
    data: response.data,
    pagination: {
      ...response.pagination,
      currentPage: response.pagination.page,
    },
  };
}

const columns: ColumnDef<PetRecord>[] = [
  {
    accessorKey: "name",
    header: "Pet",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-medium">{info.getValue<string>()}</span>
        <span className="text-xs text-gray-500">Owner #{info.row.original.userId}</span>
      </div>
    ),
  },
  {
    accessorKey: "species",
    header: "Species",
    cell: (info) => {
      const value = info.getValue<PetRecord["species"]>();
      return (
        <Chip size="sm" variant="flat" className="capitalize">
          {value}
        </Chip>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: (info) => (
      <span className="capitalize">{info.getValue<PetRecord["gender"]>()}</span>
    ),
  },
  {
    accessorKey: "weightKg",
    header: "Weight",
    cell: (info) => formatNumber(info.getValue<string | null>(), " kg"),
  },
  {
    accessorKey: "neutered",
    header: "Neutered",
    cell: (info) => (info.getValue<boolean>() ? "Yes" : "No"),
  },
  {
    accessorKey: "vaccinated",
    header: "Vaccinated",
    cell: (info) => (info.getValue<boolean>() ? "Yes" : "No"),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: (info) => {
      const value = info.getValue<string>();
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
    },
  },
];

const petsTableConfig: PaginationTableConfig<PetRecord> = {
  columns,
  fetchData: fetchPets,
  enableSearch: true,
  searchPlaceholder: "Search pets by name, breed, or color…",
  pageSizeOptions: [10, 20, 50],
  defaultPageSize: 10,
  filters: [
    {
      key: "species",
      label: "Species",
      placeholder: "Filter by species",
      options: [
        { key: "dog", label: "Dog" },
        { key: "cat", label: "Cat" },
        { key: "other", label: "Other" },
      ],
    },
  ],
};

class PetsTableBlueprint extends PaginationTableBlueprint<PetRecord> {
  constructor() {
    super({
      title: "Pets",
      description: "Customer pet profiles synced from the miniapp.",
    });
  }

  protected buildConfig(): PaginationTableConfig<PetRecord> {
    return petsTableConfig;
  }
}

export const petsTableBlueprint = new PetsTableBlueprint();
