import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { loadGrdFile } from "../src/loader/loadGrdFile.js";
import { buildRuntimeModel } from "../src/runtime/buildRuntimeModel.js";
import { validateGrd } from "../src/validator/validateGrd.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const repositoryRoot = path.resolve(currentDirectory, "../../..");
const examplesDirectory = path.join(repositoryRoot, "examples");

describe("runtime model builder", () => {
  it("builds runtime model from sales-summary.grd.yaml", async () => {
    const filePath = path.join(examplesDirectory, "sales-summary.grd.yaml");
    const definition = await loadGrdFile(filePath);
    const validation = await validateGrd(definition);

    expect(validation.valid).toBe(true);

    const model = buildRuntimeModel(definition);

    expect(model).toMatchObject({
      id: "sales-summary",
      name: "Sales Summary Report",
      description: "Monthly sales summary grouped by branch.",
      version: "0.1",
      datasource: {
        type: "table",
        table: "sales",
      },
      grouping: ["branch_id"],
      exports: ["html", "csv", "excel", "pdf"],
    });
    expect(model.filters).toHaveLength(3);
    expect(model.columns).toHaveLength(4);
    expect(model.sorting).toEqual([{ field: "invoice_date", direction: "asc" }]);
    expect(model.summary).toEqual([
      { field: "total_amount", function: "sum", label: "Total Sales" },
    ]);
  });

  it("applies default column label", () => {
    const model = buildRuntimeModel({
      version: "0.1",
      report: {
        id: "default-column-label",
        name: "Default Column Label",
      },
      datasource: {
        type: "table",
        table: "sales",
      },
      columns: [{ name: "invoice_no", type: "string" }],
    });

    expect(model.columns[0]?.label).toBe("invoice_no");
  });

  it("applies default filter required false", () => {
    const model = buildRuntimeModel({
      version: "0.1",
      report: {
        id: "default-filter-required",
        name: "Default Filter Required",
      },
      datasource: {
        type: "table",
        table: "sales",
      },
      filters: [{ name: "branch_id", type: "string" }],
      columns: [{ name: "invoice_no", label: "Invoice No", type: "string" }],
    });

    expect(model.filters[0]?.required).toBe(false);
  });

  it("applies default sorting direction asc", () => {
    const model = buildRuntimeModel({
      version: "0.1",
      report: {
        id: "default-sorting-direction",
        name: "Default Sorting Direction",
      },
      datasource: {
        type: "table",
        table: "sales",
      },
      columns: [{ name: "invoice_no", label: "Invoice No", type: "string" }],
      sorting: [{ field: "invoice_no" }],
    });

    expect(model.sorting).toEqual([{ field: "invoice_no", direction: "asc" }]);
  });

  it("rejects duplicate column names", () => {
    expect(() =>
      buildRuntimeModel({
        version: "0.1",
        report: {
          id: "duplicate-columns",
          name: "Duplicate Columns",
        },
        datasource: {
          type: "table",
          table: "sales",
        },
        columns: [
          { name: "invoice_no", label: "Invoice No", type: "string" },
          { name: "invoice_no", label: "Invoice Number", type: "string" },
        ],
      }),
    ).toThrow('Runtime model error: duplicate column name "invoice_no" exists.');
  });

  it("rejects duplicate filter names", () => {
    expect(() =>
      buildRuntimeModel({
        version: "0.1",
        report: {
          id: "duplicate-filters",
          name: "Duplicate Filters",
        },
        datasource: {
          type: "table",
          table: "sales",
        },
        filters: [
          { name: "branch_id", type: "string", required: false },
          { name: "branch_id", type: "string", required: true },
        ],
        columns: [{ name: "invoice_no", label: "Invoice No", type: "string" }],
      }),
    ).toThrow('Runtime model error: duplicate filter name "branch_id" exists.');
  });

  it("rejects sorting field not found", () => {
    expect(() =>
      buildRuntimeModel({
        version: "0.1",
        report: {
          id: "sorting-field-not-found",
          name: "Sorting Field Not Found",
        },
        datasource: {
          type: "table",
          table: "sales",
        },
        columns: [{ name: "invoice_no", label: "Invoice No", type: "string" }],
        sorting: [{ field: "missing_column", direction: "desc" }],
      }),
    ).toThrow(
      'Runtime model error: sorting field "missing_column" does not exist in columns.',
    );
  });

  it("rejects summary field not found", () => {
    expect(() =>
      buildRuntimeModel({
        version: "0.1",
        report: {
          id: "summary-field-not-found",
          name: "Summary Field Not Found",
        },
        datasource: {
          type: "table",
          table: "sales",
        },
        columns: [{ name: "invoice_no", label: "Invoice No", type: "string" }],
        summary: [{ field: "missing_column", function: "count" }],
      }),
    ).toThrow(
      'Runtime model error: summary field "missing_column" does not exist in columns.',
    );
  });

  it("allows grouping by column", () => {
    const model = buildRuntimeModel({
      version: "0.1",
      report: {
        id: "group-by-column",
        name: "Group By Column",
      },
      datasource: {
        type: "table",
        table: "sales",
      },
      columns: [{ name: "branch_id", label: "Branch", type: "string" }],
      grouping: ["branch_id"],
    });

    expect(model.grouping).toEqual(["branch_id"]);
  });

  it("allows grouping by filter", () => {
    const model = buildRuntimeModel({
      version: "0.1",
      report: {
        id: "group-by-filter",
        name: "Group By Filter",
      },
      datasource: {
        type: "table",
        table: "sales",
      },
      filters: [{ name: "branch_id", type: "string", required: false }],
      columns: [{ name: "invoice_no", label: "Invoice No", type: "string" }],
      grouping: ["branch_id"],
    });

    expect(model.grouping).toEqual(["branch_id"]);
  });
});
