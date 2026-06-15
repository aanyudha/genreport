import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { loadGrdFile } from "../src/loader/loadGrdFile.js";
import { validateGrd } from "../src/validator/validateGrd.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const repositoryRoot = path.resolve(currentDirectory, "../../..");
const examplesDirectory = path.join(repositoryRoot, "examples");
const invalidExamplesDirectory = path.join(examplesDirectory, "invalid");

describe("GRD loading and validation", () => {
  it("passes the sales-summary example", async () => {
    const filePath = path.join(examplesDirectory, "sales-summary.grd.yaml");
    const definition = await loadGrdFile(filePath);
    const result = await validateGrd(definition);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("passes all valid examples", async () => {
    const files = [
      "customer-balance.grd.yaml",
      "hotel-occupancy.grd.yaml",
      "inventory-summary.grd.yaml",
      "member-expiry.grd.yaml",
      "sales-summary.grd.yaml",
    ];

    const results = await Promise.all(
      files.map(async (fileName) => {
        const definition = await loadGrdFile(path.join(examplesDirectory, fileName));
        return validateGrd(definition);
      }),
    );

    for (const result of results) {
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });

  it("fails all invalid examples", async () => {
    const files = [
      "invalid-invalid-export.grd.yaml",
      "invalid-missing-datasource.grd.yaml",
      "invalid-missing-report.grd.yaml",
    ];

    const results = await Promise.all(
      files.map(async (fileName) => {
        const definition = await loadGrdFile(path.join(invalidExamplesDirectory, fileName));
        return validateGrd(definition);
      }),
    );

    for (const result of results) {
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("fails clearly for unsupported file extensions", async () => {
    await expect(loadGrdFile(path.join(currentDirectory, "fixtures", "unsupported.grd.txt"))).rejects.toThrow(
      'Unsupported GRD file extension ".txt"',
    );
  });

  it("fails clearly for malformed YAML", async () => {
    await expect(loadGrdFile(path.join(currentDirectory, "fixtures", "malformed.grd.yaml"))).rejects.toThrow(
      "Failed to parse YAML",
    );
  });
});
