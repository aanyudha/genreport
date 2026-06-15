import type { GenReportScalarType } from "../types/GenReportDefinition.js";

export interface FilterModel {
  name: string;
  type: GenReportScalarType;
  required: boolean;
}
