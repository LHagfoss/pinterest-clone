import type { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";
import {
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from "@react-native-firebase/firestore";
import type { Pin, UserProfile } from "@/src/schemas";
import { getColorNameFromHex } from "@/src/utils/colors";

// Standard page size
const PAGE_SIZE = 15;

export const getFeed = async (
    user: FirebaseAuthTypes.User | null,
    lastVisible: QueryDocumentSnapshot<DocumentData> | null,
): Promise<{
    pins: Pin[];
    lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}> => {
    const db = getFirestore();
    const pinsRef = collection(db, "pins");

    try {
        // --- 1. THE DISCOVERY QUERY (The "Backbone") ---
        // This ensures infinite scroll always works. We fetch based on high scores.
        let baseQuery = query(
            pinsRef,
            orderBy("stats.score", "desc"), // Show popular stuff first
            limit(PAGE_SIZE),
        );

        // Apply pagination cursor if it exists
        if (lastVisible) {
            baseQuery = query(baseQuery, startAfter(lastVisible));
        }

        const discoverySnapshot = await getDocs(baseQuery);
        const lastDoc =
            discoverySnapshot.docs[discoverySnapshot.docs.length - 1] || null;

        // --- 2. THE PERSONALIZED QUERY (The "Spice") ---
        // Only run this if we have a user and they haven't scrolled too far (optional optimization)
        let nicheDocs: QueryDocumentSnapshot<DocumentData>[] = [];

        if (user?.tagAffinity && Object.keys(user.tagAffinity).length > 0) {
            // Get top 3 tags user loves
            const topTags = Object.entries(user.tagAffinity)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([tag]) => tag);

            if (topTags.length > 0) {
                // Fetch 5 specific pins matching these tags
                const nicheQuery = query(
                    pinsRef,
                    where("tags", "array-contains-any", topTags),
                    orderBy("stats.score", "desc"),
                    limit(5),
                );

                // Note: We don't paginate this strictly. We just grab fresh ones.
                const nicheSnapshot = await getDocs(nicheQuery);
                nicheDocs = nicheSnapshot.docs;
            }
        }

        // --- 3. MERGE & DEDUPLICATE ---
        const allDocs = [...discoverySnapshot.docs, ...nicheDocs];
        const uniqueMap = new Map();

        allDocs.forEach((doc) => {
            // Skip if user has seen it (optional, requires keeping a huge list in user profile)
            // if (user?.seenPinIds?.includes(doc.id)) return;

            uniqueMap.set(doc.id, { id: doc.id, ...doc.data() } as Pin);
        });

        let mixedPins = Array.from(uniqueMap.values());

        // --- 4. THE RANKING ALGORITHM (Client-Side Sorting) ---
        // If we have a user, re-sort this mixed batch based on their specific tastes
        if (user) {
            mixedPins = mixedPins
                .map((pin) => {
                    let algoScore = pin.stats?.score || 0; // Start with global popularity

                    // Boost for Tag Match
                    pin.tags?.forEach((tag) => {
                        const interest = user.tagAffinity?.[tag] || 0;
                        algoScore += interest * 10; // High weight for interest match
                    });

                    // Boost for Color Match
                    const colorName = getColorNameFromHex(
                        pin.dominantColor || "#000000",
                    );
                    const colorInterest = user.tagAffinity?.[colorName] || 0;
                    algoScore += colorInterest * 5; // Medium weight for color/vibe match

                    return { ...pin, _tempScore: algoScore };
                })
                // Sort descending by our new calculated score
                .sort((a, b) => b._tempScore - a._tempScore)
                // Clean up the temp property
                .map(({ _tempScore, ...pin }) => pin as Pin);
        }

        return {
            pins: mixedPins,
            lastVisible: lastDoc, // Return the cursor from the Main Discovery query
        };
    } catch (error) {
        console.error("Error fetching feed:", error);
        return { pins: [], lastVisible: null };
    }
};
