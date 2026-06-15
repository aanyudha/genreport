import { readFile } from "node:fs/promises";
import path from "node:path";

import { parseGrd } from "../parser/parseGrd.js";

export async function loadGrdFile(filePath: string): Promise<unknown> {
  const extension = path.extname(filePath);
  const contents = await readFile(filePath, "utf8");

  return parseGrd(contents, extension);
}
