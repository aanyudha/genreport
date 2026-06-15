import type { GenReportScalarType } from "../types/GenReportDefinition.js";

export interface ColumnModel {
  name: string;
  label: string;
  type: GenReportScalarType;
}
