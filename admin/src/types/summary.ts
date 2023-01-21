export interface SummaryRow {
  id: number;
  name: string;
  columns: SummaryColumn[];
}

export interface SummaryColumn {
  id: number;
  name: string;
  amount: number;
}
