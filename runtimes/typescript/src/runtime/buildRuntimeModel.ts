import type {
  GenReportScalarType,
  GenReportSummary,
} from "../types/GenReportDefinition.js";
import type { ColumnModel } from "../model/ColumnModel.js";
import type { DatasourceModel } from "../model/DatasourceModel.js";
import type { ExportModel } from "../model/ExportModel.js";
import type { FilterModel } from "../model/FilterModel.js";
import type { ReportModel } from "../model/ReportModel.js";
import type { SortingModel } from "../model/SortingModel.js";
import type { SummaryModel } from "../model/SummaryModel.js";

const SCALAR_TYPES = new Set<GenReportScalarType>([
  "string",
  "number",
  "integer",
  "boolean",
  "date",
  "datetime",
]);

const SORTING_DIRECTIONS = new Set<SortingModel["direction"]>(["asc", "desc"]);
const SUMMARY_FUNCTIONS = new Set<GenReportSummary["function"]>([
  "sum",
  "avg",
  "min",
  "max",
  "count",
]);
const EXPORT_TYPES = new Set<ExportModel>(["html", "csv", "excel", "pdf"]);

export function buildRuntimeModel(definition: unknown): ReportModel {
  const root = expectRecord(definition, "GRD definition must be an object.");
  const version = expectVersion(root.version);

  const report = expectRecord(root.report, "report must be an object.");
  const datasource = buildDatasourceModel(root.datasource);
  const filters = buildFilterModels(root.filters);
  const columns = buildColumnModels(root.columns);
  const sorting = buildSortingModels(root.sorting);
  const grouping = buildGrouping(root.grouping);
  const summary = buildSummaryModels(root.summary);
  const exports = buildExportModels(root.exports);

  const columnNames = assertUniqueNames(
    columns.map((column) => column.name),
    "column",
  );
  const filterNames = assertUniqueNames(
    filters.map((filter) => filter.name),
    "filter",
  );

  for (const item of sorting) {
    if (!columnNames.has(item.field)) {
      throw runtimeModelError(
        `sorting field "${item.field}" does not exist in columns.`,
      );
    }
  }

  for (const item of summary) {
    if (!columnNames.has(item.field)) {
      throw runtimeModelError(
        `summary field "${item.field}" does not exist in columns.`,
      );
    }
  }

  for (const field of grouping) {
    if (!columnNames.has(field) && !filterNames.has(field)) {
      throw runtimeModelError(
        `grouping field "${field}" does not exist in columns or filters.`,
      );
    }
  }

  return {
    id: expectNonEmptyString(report.id, "report.id is empty."),
    name: expectNonEmptyString(report.name, "report.name is empty."),
    description: expectOptionalString(report.description, "report.description") ?? "",
    version,
    datasource,
    filters,
    columns,
    sorting,
    grouping,
    summary,
    exports,
  };
}

function buildDatasourceModel(value: unknown): DatasourceModel {
  const datasource = expectRecord(value, "datasource must be an object.");
  const type = expectString(datasource.type, "datasource.type");

  if (type !== "table") {
    throw runtimeModelError(`Unsupported datasource.type "${type}".`);
  }

  return {
    type,
    table: expectNonEmptyString(datasource.table, "datasource.table is empty."),
  };
}

function buildFilterModels(value: unknown): FilterModel[] {
  const filters = expectOptionalArray(value, "filters");

  return filters.map((item, index) => {
    const filter = expectRecord(item, `filters[${index}] must be an object.`);

    return {
      name: expectNonEmptyString(
        filter.name,
        `filters[${index}].name must be a non-empty string.`,
      ),
      type: expectScalarType(filter.type, `filters[${index}].type`),
      required: expectOptionalBoolean(
        filter.required,
        `filters[${index}].required`,
      ) ?? false,
    };
  });
}

function buildColumnModels(value: unknown): ColumnModel[] {
  const columns = expectArray(value, "columns");

  if (columns.length === 0) {
    throw runtimeModelError("columns is empty.");
  }

  return columns.map((item, index) => {
    const column = expectRecord(item, `columns[${index}] must be an object.`);
    const name = expectNonEmptyString(
      column.name,
      `columns[${index}].name must be a non-empty string.`,
    );

    return {
      name,
      label: expectOptionalString(column.label, `columns[${index}].label`) ?? name,
      type: expectScalarType(column.type, `columns[${index}].type`),
    };
  });
}

function buildSortingModels(value: unknown): SortingModel[] {
  const sorting = expectOptionalArray(value, "sorting");

  return sorting.map((item, index) => {
    const sort = expectRecord(item, `sorting[${index}] must be an object.`);
    const direction =
      expectOptionalString(sort.direction, `sorting[${index}].direction`) ?? "asc";

    if (!SORTING_DIRECTIONS.has(direction as SortingModel["direction"])) {
      throw runtimeModelError(
        `sorting[${index}].direction must be one of: asc, desc.`,
      );
    }

    return {
      field: expectNonEmptyString(
        sort.field,
        `sorting[${index}].field must be a non-empty string.`,
      ),
      direction: direction as SortingModel["direction"],
    };
  });
}

function buildGrouping(value: unknown): string[] {
  const grouping = expectOptionalArray(value, "grouping");

  return grouping.map((item, index) =>
    expectNonEmptyString(
      item,
      `grouping[${index}] must be a non-empty string.`,
    ),
  );
}

function buildSummaryModels(value: unknown): SummaryModel[] {
  const summary = expectOptionalArray(value, "summary");

  return summary.map((item, index) => {
    const entry = expectRecord(item, `summary[${index}] must be an object.`);
    const fn = expectString(entry.function, `summary[${index}].function`);

    if (!SUMMARY_FUNCTIONS.has(fn as GenReportSummary["function"])) {
      throw runtimeModelError(
        `summary[${index}].function must be one of: sum, avg, min, max, count.`,
      );
    }

    return {
      field: expectNonEmptyString(
        entry.field,
        `summary[${index}].field must be a non-empty string.`,
      ),
      function: fn as GenReportSummary["function"],
      label: expectOptionalString(entry.label, `summary[${index}].label`),
    };
  });
}

function buildExportModels(value: unknown): ExportModel[] {
  const exports = expectOptionalArray(value, "exports");

  return exports.map((item, index) => {
    const exportType = expectString(item, `exports[${index}]`);

    if (!EXPORT_TYPES.has(exportType as ExportModel)) {
      throw runtimeModelError(
        `exports[${index}] must be one of: html, csv, excel, pdf.`,
      );
    }

    return exportType as ExportModel;
  });
}

function assertUniqueNames(names: string[], kind: "column" | "filter"): Set<string> {
  const seen = new Set<string>();

  for (const name of names) {
    if (seen.has(name)) {
      throw runtimeModelError(`duplicate ${kind} name "${name}" exists.`);
    }

    seen.add(name);
  }

  return seen;
}

function expectVersion(value: unknown): "0.1" {
  const version = expectString(value, "version");

  if (version !== "0.1") {
    throw runtimeModelError(`Unsupported version "${version}".`);
  }

  return version;
}

function expectScalarType(value: unknown, path: string): GenReportScalarType {
  const scalarType = expectString(value, path);

  if (!SCALAR_TYPES.has(scalarType as GenReportScalarType)) {
    throw runtimeModelError(
      `${path} must be one of: string, number, integer, boolean, date, datetime.`,
    );
  }

  return scalarType as GenReportScalarType;
}

function expectRecord(value: unknown, message: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw runtimeModelError(message);
  }

  return value as Record<string, unknown>;
}

function expectArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw runtimeModelError(`${path} must be an array.`);
  }

  return value;
}

function expectOptionalArray(value: unknown, path: string): unknown[] {
  if (typeof value === "undefined") {
    return [];
  }

  return expectArray(value, path);
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== "string") {
    throw runtimeModelError(`${path} must be a string.`);
  }

  return value;
}

function expectNonEmptyString(value: unknown, message: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw runtimeModelError(message);
  }

  return value;
}

function expectOptionalString(value: unknown, path: string): string | undefined {
  if (typeof value === "undefined") {
    return undefined;
  }

  return expectString(value, path);
}

function expectOptionalBoolean(value: unknown, path: string): boolean | undefined {
  if (typeof value === "undefined") {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw runtimeModelError(`${path} must be a boolean.`);
  }

  return value;
}

function runtimeModelError(message: string): Error {
  return new Error(`Runtime model error: ${message}`);
}
