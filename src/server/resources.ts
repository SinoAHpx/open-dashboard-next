import { Prisma } from "@prisma/client";

export type ResourceKey =
  | "membership-levels"
  | "membership-benefits"
  | "users"
  | "user-memberships"
  | "user-points-ledger"
  | "pets"
  | "stores"
  | "store-images"
  | "store-promotions"
  | "store-reviews"
  | "homepage-carousel-slides"
  | "service-categories"
  | "service-items"
  | "service-media"
  | "store-service-items"
  | "orders"
  | "order-items"
  | "order-events";

export interface ResourceConfig {
  model: Prisma.ModelName;
  searchFields?: string[];
  defaultOrderBy?: Record<string, "asc" | "desc">;
  readOnlyFields?: string[];
}

const defaultReadOnly = ["id", "createdAt", "updatedAt", "created_at", "updated_at"];

export const resourceConfigs: Record<ResourceKey, ResourceConfig> = {
  "membership-levels": {
    model: Prisma.ModelName.MembershipLevel,
    searchFields: ["code", "name"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "membership-benefits": {
    model: Prisma.ModelName.MembershipBenefit,
    searchFields: ["label"],
    defaultOrderBy: { displayOrder: "asc" },
    readOnlyFields: defaultReadOnly,
  },
  users: {
    model: Prisma.ModelName.User,
    searchFields: ["openId", "phone", "nickname"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "user-memberships": {
    model: Prisma.ModelName.UserMembership,
    searchFields: ["status"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "user-points-ledger": {
    model: Prisma.ModelName.UserPointsLedger,
    searchFields: ["reason", "referenceType"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  pets: {
    model: Prisma.ModelName.Pet,
    searchFields: ["name", "breed", "color"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  stores: {
    model: Prisma.ModelName.Store,
    searchFields: ["name", "slug", "city", "province"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "store-images": {
    model: Prisma.ModelName.StoreImage,
    searchFields: ["imageUrl"],
    defaultOrderBy: { displayOrder: "asc" },
    readOnlyFields: defaultReadOnly,
  },
  "store-promotions": {
    model: Prisma.ModelName.StorePromotion,
    searchFields: ["title", "description", "discountText"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "store-reviews": {
    model: Prisma.ModelName.StoreReview,
    searchFields: ["content"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "homepage-carousel-slides": {
    model: Prisma.ModelName.HomepageCarouselSlide,
    searchFields: ["title", "linkUrl"],
    defaultOrderBy: { displayOrder: "asc" },
    readOnlyFields: defaultReadOnly,
  },
  "service-categories": {
    model: Prisma.ModelName.ServiceCategory,
    searchFields: ["name", "slug"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "service-items": {
    model: Prisma.ModelName.ServiceItem,
    searchFields: ["title", "subtitle"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "service-media": {
    model: Prisma.ModelName.ServiceMedia,
    searchFields: ["mediaUrl", "mediaType", "caption"],
    defaultOrderBy: { displayOrder: "asc" },
    readOnlyFields: defaultReadOnly,
  },
  "store-service-items": {
    model: Prisma.ModelName.StoreServiceItem,
    defaultOrderBy: { id: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  orders: {
    model: Prisma.ModelName.Order,
    searchFields: ["orderNo", "status"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "order-items": {
    model: Prisma.ModelName.OrderItem,
    searchFields: ["serviceName", "serviceType"],
    defaultOrderBy: { id: "desc" },
    readOnlyFields: defaultReadOnly,
  },
  "order-events": {
    model: Prisma.ModelName.OrderEvent,
    searchFields: ["remark"],
    defaultOrderBy: { createdAt: "desc" },
    readOnlyFields: defaultReadOnly,
  },
};

export const resourceKeys = Object.keys(resourceConfigs) as ResourceKey[];

export function getResourceConfig(resource: string): ResourceConfig | null {
  return resourceConfigs[resource as ResourceKey] ?? null;
}

