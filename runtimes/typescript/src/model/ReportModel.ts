import type { ColumnModel } from "./ColumnModel.js";
import type { DatasourceModel } from "./DatasourceModel.js";
import type { ExportModel } from "./ExportModel.js";
import type { FilterModel } from "./FilterModel.js";
import type { SortingModel } from "./SortingModel.js";
import type { SummaryModel } from "./SummaryModel.js";

export interface ReportModel {
  id: string;
  name: string;
  description: string;
  version: "0.1";
  datasource: DatasourceModel;
  filters: FilterModel[];
  columns: ColumnModel[];
  sorting: SortingModel[];
  grouping: string[];
  summary: SummaryModel[];
  exports: ExportModel[];
}
