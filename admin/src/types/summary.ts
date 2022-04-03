export interface SummaryRow {
  name: string;
  columns: SummaryColumn[];
}

export interface SummaryColumn {
  name: string;
  amount: number;
}
