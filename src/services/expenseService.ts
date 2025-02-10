import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";

export type TExpense = {
  id?: string;
  billId: number;
  description: string;
  amount: string;
  createdAt: string;
};

const COLLECTION_NAME = "expenses";

export const expenseService = {
  async createExpense(expense: TExpense): Promise<TExpense> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...expense,
      createdAt: new Date().toISOString(),
    });
    return { ...expense, id: docRef.id };
  },

  async getExpensesByBillId(billId: number): Promise<TExpense[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("billId", "==", billId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as TExpense)
    );
  },

  async deleteExpense(expenseId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, expenseId);
    await deleteDoc(docRef);
  },
};
