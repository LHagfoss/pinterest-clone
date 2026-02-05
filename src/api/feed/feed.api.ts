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

const PAGE_SIZE = 15;

export const getFeed = async (
    user: UserProfile | null,
    lastVisible: QueryDocumentSnapshot<DocumentData> | null,
): Promise<{
    pins: Pin[];
    lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}> => {
    const db = getFirestore();
    const pinsRef = collection(db, "pins");

    try {
        let baseQuery = query(
            pinsRef,
            orderBy("createdAt", "desc"),
            limit(PAGE_SIZE),
        );

        if (lastVisible) {
            baseQuery = query(baseQuery, startAfter(lastVisible));
        }

        const discoverySnapshot = await getDocs(baseQuery);
        const lastDoc =
            discoverySnapshot.docs[discoverySnapshot.docs.length - 1] || null;

        let nicheDocs: QueryDocumentSnapshot<DocumentData>[] = [];

        if (user?.tagAffinity && Object.keys(user.tagAffinity).length > 0) {
            const topTags = Object.entries(user.tagAffinity)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([tag]) => tag);

            if (topTags.length > 0) {
                const nicheQuery = query(
                    pinsRef,
                    where("tags", "array-contains-any", topTags),
                    orderBy("createdAt", "desc"),
                    limit(5),
                );

                const nicheSnapshot = await getDocs(nicheQuery);
                nicheDocs = nicheSnapshot.docs;
            }
        }

        const allDocs = [...discoverySnapshot.docs, ...nicheDocs];
        const uniqueMap = new Map<string, Pin>();

        for (const doc of allDocs) {
            uniqueMap.set(doc.id, { id: doc.id, ...doc.data() } as Pin);
        }

        let mixedPins = Array.from(uniqueMap.values());

        if (user) {
            mixedPins = mixedPins
                .map((pin) => {
                    let algoScore = pin.stats?.score || 0;

                    pin.tags?.forEach((tag: string) => {
                        const interest = user.tagAffinity?.[tag] || 0;
                        algoScore += interest * 10;
                    });

                    const colorName = getColorNameFromHex(
                        pin.dominantColor || "#000000",
                    );
                    const colorInterest = user.tagAffinity?.[colorName] || 0;
                    algoScore += colorInterest * 5;

                    return { ...pin, _tempScore: algoScore };
                })
                .sort((a, b) => (b as any)._tempScore - (a as any)._tempScore)
                .map(({ _tempScore, ...pin }) => pin as Pin);
        }

        return {
            pins: mixedPins,
            lastVisible: lastDoc,
        };
    } catch (error) {
        console.error("Error fetching feed:", error);
        return { pins: [], lastVisible: null };
    }
};
