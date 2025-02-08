export enum BillStatus {
  Completed = "completed",
  Active = "active",
}

export type TBill = {
  id: number;
  status: BillStatus;
  createdAt: string;
  completedAt?: string;
  expenses: TExpense[];
  members: string[];
};

export type TExpense = {
  id: number;
  description: string;
  amount: string;
  paidBy: string;
  date: string;
};
