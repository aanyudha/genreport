export interface SummaryModel {
  field: string;
  function: "sum" | "avg" | "min" | "max" | "count";
  label?: string;
}
