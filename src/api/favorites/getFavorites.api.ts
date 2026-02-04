import { collection, getDocs, getFirestore, query, orderBy } from "@react-native-firebase/firestore";
import type { Pin } from "@/src/schemas";

export const getFavorites = async (userId: string): Promise<Pin[]> => {
    try {
        const db = getFirestore();
        const favoritesRef = collection(db, "users", userId, "favorites");
        const q = query(favoritesRef, orderBy("savedAt", "desc"));
        
        const querySnapshot = await getDocs(q);
        const pins: Pin[] = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Remove savedAt from the data spread if it conflicts, but Pin schema has optional createdAt/any
            pins.push(data as Pin); 
        });
        
        return pins;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};
