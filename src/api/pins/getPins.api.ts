import {
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
} from "@react-native-firebase/firestore";
import type { Pin } from "@/src/schemas";

export const getPins = async (): Promise<Pin[]> => {
    try {
        const db = getFirestore();
        const q = query(
            collection(db, "pins"),
            orderBy("createdAt", "desc"),
            limit(50),
        );

        const querySnapshot = await getDocs(q);
        const pins: Pin[] = [];

        querySnapshot.forEach((doc) => {
            pins.push(doc.data() as Pin);
        });

        return pins;
    } catch (error) {
        console.error("Error fetching pins:", error);
        return [];
    }
};
