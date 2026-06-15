import { parse as parseYaml } from "yaml";

const YAML_EXTENSIONS = new Set([".yaml", ".yml"]);
const JSON_EXTENSIONS = new Set([".json"]);

export function parseGrd(contents: string, extension: string): unknown {
  const normalizedExtension = extension.toLowerCase();

  if (YAML_EXTENSIONS.has(normalizedExtension)) {
    try {
      return parseYaml(contents);
    } catch (error) {
      throw new Error(formatParseError("YAML", error));
    }
  }

  if (JSON_EXTENSIONS.has(normalizedExtension)) {
    try {
      return JSON.parse(contents) as unknown;
    } catch (error) {
      throw new Error(formatParseError("JSON", error));
    }
  }

  throw new Error(
    `Unsupported GRD file extension "${extension}". Expected one of: .yaml, .yml, .json.`,
  );
}

function formatParseError(format: "YAML" | "JSON", error: unknown): string {
  if (error instanceof Error && error.message) {
    return `Failed to parse ${format}: ${error.message}`;
  }

  return `Failed to parse ${format}.`;
}
