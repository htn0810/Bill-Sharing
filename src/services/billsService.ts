import {
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { TBill } from "@/ProjectType";

const COLLECTION_NAME = "bills";

export const billsService = {
  async createBill(bill: TBill): Promise<TBill> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), bill);
    return { ...bill, id: parseInt(docRef.id) };
  },

  async getAllBills(): Promise<TBill[]> {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data() } as TBill));
  },

  async updateBillStatus(billId: number, status: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, billId.toString());
    await updateDoc(docRef, {
      status: status,
      completedAt: new Date().toISOString(),
    });
  },

  async getBillById(billId: string): Promise<TBill | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("id", "==", parseInt(billId))
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      console.log(doc.data());
      return { ...doc.data() } as TBill;
    } catch (error) {
      console.error("Error getting bill by name:", error);
      return null;
    }
  },
};
