export enum BillStatus {
  Completed = "completed",
  Active = "active",
}

export type TBill = {
  id: number;
  name: string;
  status: BillStatus;
  createdAt: string;
  completedAt?: string;
  expenses: TExpense[];
  members: string[];
};

export type TExpense = {
  id: number;
  billId: number;
  description: string;
  amount: string;
  paidBy: string;
  category: string;
  date: string;
  createdAt?: string;
};

export type TCategory = {
  name: string;
};
