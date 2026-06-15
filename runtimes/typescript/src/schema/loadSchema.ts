import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface LoadSchemaOptions {
  schemaPath?: string;
}

export async function loadSchema(options: LoadSchemaOptions = {}): Promise<object> {
  const resolvedPath = options.schemaPath
    ? path.resolve(options.schemaPath)
    : await resolveDefaultSchemaPath();

  try {
    const contents = await readFile(resolvedPath, "utf8");
    return JSON.parse(contents) as object;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to load GenReport schema from "${resolvedPath}": ${error.message}`);
    }

    throw new Error(`Unable to load GenReport schema from "${resolvedPath}".`);
  }
}

async function resolveDefaultSchemaPath(): Promise<string> {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
  const candidates = findSchemaCandidates(moduleDirectory);

  for (const candidate of candidates) {
    try {
      await readFile(candidate, "utf8");
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error(
    `Unable to locate GenReport schema automatically. Checked: ${candidates.join(", ")}`,
  );
}

function findSchemaCandidates(startDirectory: string): string[] {
  const candidates: string[] = [];
  let currentDirectory = startDirectory;

  while (true) {
    candidates.push(path.join(currentDirectory, "schema", "genreport.schema.json"));

    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      break;
    }

    currentDirectory = parentDirectory;
  }

  return candidates;
}
