import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";

import type { GenReportDefinition } from "../types/GenReportDefinition.js";
import { loadSchema, type LoadSchemaOptions } from "../schema/loadSchema.js";

export interface ValidationError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  message: string;
  params: ErrorObject["params"];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export async function validateGrd(
  definition: unknown,
  options: LoadSchemaOptions = {},
): Promise<ValidationResult> {
  const schema = await loadSchema(options);
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
  });

  const validate = ajv.compile<GenReportDefinition>(schema);
  const valid = validate(definition);

  return {
    valid,
    errors: (validate.errors ?? []).map(mapValidationError),
  };
}

function mapValidationError(error: ErrorObject): ValidationError {
  return {
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    keyword: error.keyword,
    message: error.message ?? "Validation error.",
    params: error.params,
  };
}
