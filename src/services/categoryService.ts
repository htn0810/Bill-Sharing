import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase";
import { TCategory } from "@/ProjectType";

const COLLECTION_NAME = "categories";

export const categoryService = {
  async getAllCategories(): Promise<TCategory[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        return {
          name: doc.data().name as string,
        };
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  },
};
