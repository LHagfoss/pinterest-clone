import {
    collection,
    getDocs,
    getFirestore,
    limit,
    query,
    where,
} from "@react-native-firebase/firestore";
import type { Pin } from "@/src/schemas";

export const getRecommendedPins = async (
    tags: string[],
    currentPinId?: string,
): Promise<Pin[]> => {
    try {
        const db = getFirestore();
        const pinsRef = collection(db, "pins");
        let q;

        // Firestore 'array-contains-any' is limited to 10 values
        const searchTags = tags.slice(0, 10);

        if (searchTags.length > 0) {
            q = query(
                pinsRef,
                where("tags", "array-contains-any", searchTags),
                limit(50),
            );
        } else {
            // Fallback to recent pins if no tags
            // Note: In a real app, might want a different fallback logic
            return [];
        }

        const querySnapshot = await getDocs(q);
        const pins: Pin[] = [];

        querySnapshot.forEach((doc) => {
            const pinData = doc.data() as Pin;
            // Exclude current pin
            if (pinData.id !== currentPinId) {
                pins.push(pinData);
            }
        });

        // "Weight-based" sorting:
        // Sort by number of matching tags (descending)
        pins.sort((a, b) => {
            const aMatches =
                a.tags?.filter((t) => tags.includes(t)).length ?? 0;
            const bMatches =
                b.tags?.filter((t) => tags.includes(t)).length ?? 0;
            return bMatches - aMatches;
        });

        return pins;
    } catch (error) {
        console.error("Error fetching recommended pins:", error);
        return [];
    }
};
