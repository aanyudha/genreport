#!/usr/bin/env node

import process from "node:process";
import path from "node:path";

import { loadGrdFile } from "../loader/loadGrdFile.js";
import { validateGrd } from "../validator/validateGrd.js";

async function main(): Promise<void> {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error("Usage: npm run validate -- <path-to-file.grd.yaml|.grd.yml|.grd.json>");
    process.exitCode = 1;
    return;
  }

  try {
    const resolvedPath = path.resolve(inputPath);
    const definition = await loadGrdFile(resolvedPath);
    const result = await validateGrd(definition);

    if (result.valid) {
      console.log(`GRD is valid: ${resolvedPath}`);
      process.exitCode = 0;
      return;
    }

    console.error(`GRD is invalid: ${resolvedPath}`);

    for (const error of result.errors) {
      const location = error.instancePath || "/";
      console.error(`- ${location}: ${error.message} (${error.keyword})`);
    }

    process.exitCode = 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    console.error(`Failed to validate GRD: ${message}`);
    process.exitCode = 1;
  }
}

void main();
