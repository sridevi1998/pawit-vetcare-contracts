import type { components, paths } from "./pawit-api";

export type { components, operations, paths } from "./pawit-api";

export type ApiPath = keyof paths;
export type SchemaName = keyof components["schemas"];
