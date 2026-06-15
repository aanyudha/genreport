export type GenReportScalarType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "datetime";

export interface GenReportMetadata {
  id: string;
  name: string;
  description?: string;
}

export interface GenReportDatasource {
  type: "table";
  table: string;
}

export interface GenReportFilter {
  name: string;
  type: GenReportScalarType;
  required: boolean;
}

export interface GenReportColumn {
  name: string;
  label: string;
  type: GenReportScalarType;
}

export interface GenReportSorting {
  field: string;
  direction: "asc" | "desc";
}

export interface GenReportSummary {
  field: string;
  function: "sum" | "avg" | "min" | "max" | "count";
  label?: string;
}

export type GenReportExport = "html" | "csv" | "excel" | "pdf";

export interface GenReportDefinition {
  version: "0.1";
  report: GenReportMetadata;
  datasource: GenReportDatasource;
  filters?: GenReportFilter[];
  columns: GenReportColumn[];
  sorting?: GenReportSorting[];
  grouping?: string[];
  summary?: GenReportSummary[];
  exports?: GenReportExport[];
}
