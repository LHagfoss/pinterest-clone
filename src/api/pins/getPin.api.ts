import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import type { Pin } from "@/src/schemas";

export const getPin = async (id: string): Promise<Pin | null> => {
    try {
        const db = getFirestore();
        const docRef = doc(db, "pins", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() } as Pin;
        }
        return null;
    } catch (error) {
        console.error("Error fetching pin:", error);
        return null;
    }
};
