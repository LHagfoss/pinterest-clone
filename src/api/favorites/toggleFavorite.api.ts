import {
    deleteDoc,
    doc,
    getDoc,
    getFirestore,
    serverTimestamp,
    setDoc,
} from "@react-native-firebase/firestore";
import type { Pin } from "@/src/schemas";

export const toggleFavorite = async (
    userId: string,
    pin: Pin,
): Promise<boolean> => {
    try {
        console.log(
            `[toggleFavorite] START - User: ${userId}, Pin: ${pin.id} (Type: ${typeof pin.id})`,
        );
        const db = getFirestore();
        const favoriteRef = doc(
            db,
            "users",
            userId,
            "favorites",
            String(pin.id),
        );
        console.log(`[toggleFavorite] Ref Path: ${favoriteRef.path}`);

        const docSnap = await getDoc(favoriteRef);
        const exists = docSnap.exists();
        console.log(`[toggleFavorite] Doc Exists: ${exists}`);

        if (exists) {
            console.log(`[toggleFavorite] ACTION: Removing favorite`);
            await deleteDoc(favoriteRef);
            return false;
        } else {
            console.log(`[toggleFavorite] ACTION: Adding favorite`);
            await setDoc(favoriteRef, {
                ...pin,
                savedAt: serverTimestamp(),
            });
            return true;
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        throw error;
    }
};

export const checkIsFavorited = async (
    userId: string,
    pinId: string,
): Promise<boolean> => {
    try {
        const db = getFirestore();
        const favoriteRef = doc(
            db,
            "users",
            userId,
            "favorites",
            String(pinId),
        );
        const docSnap = await getDoc(favoriteRef);
        return docSnap.exists();
    } catch (error) {
        console.error(error);
        return false;
    }
};
