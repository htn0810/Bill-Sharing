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
import { TExpense } from "@/ProjectType";

const COLLECTION_NAME = "expenses";

export const expenseService = {
  async createExpense(expense: TExpense): Promise<TExpense> {
    await addDoc(collection(db, COLLECTION_NAME), {
      ...expense,
      createdAt: new Date().toISOString(),
    });
    return { ...expense };
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
        } as TExpense)
    );
  },

  async deleteExpenseById(id: number): Promise<void> {
    const q = query(collection(db, COLLECTION_NAME), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = doc(db, COLLECTION_NAME, querySnapshot.docs[0].id);
      await deleteDoc(docRef);
    }
  },
};
