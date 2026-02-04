import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    where,
} from "@react-native-firebase/firestore";
import type { Pin } from "@/src/schemas";

export const getUserPins = async (userId: string): Promise<Pin[]> => {
    try {
        const db = getFirestore();
        const q = query(
            collection(db, "pins"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
        );

        const querySnapshot = await getDocs(q);
        const pins: Pin[] = [];

        querySnapshot.forEach((doc) => {
            pins.push(doc.data() as Pin);
        });

        return pins;
    } catch (error) {
        console.error("Error fetching user pins:", error);
        return [];
    }
};

export const deletePin = async (pinId: string): Promise<void> => {
    try {
        const db = getFirestore();
        await deleteDoc(doc(db, "pins", pinId));
    } catch (error) {
        console.error("Error deleting pin:", error);
        throw error;
    }
};
