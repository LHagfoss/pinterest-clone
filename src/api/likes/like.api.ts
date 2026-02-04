import {
    deleteDoc,
    doc,
    getDoc,
    getFirestore,
    serverTimestamp,
    setDoc,
} from "@react-native-firebase/firestore";

export const toggleLike = async (
    userId: string,
    pinId: string,
): Promise<boolean> => {
    try {
        const db = getFirestore();
        // Reference to the specific like document: pins/{pinId}/likes/{userId}
        const likeRef = doc(db, "pins", pinId, "likes", userId);

        const docSnap = await getDoc(likeRef);
        const exists = docSnap.exists();

        if (exists) {
            await deleteDoc(likeRef);
            return false; // Unlike
        } else {
            await setDoc(likeRef, {
                userId,
                likedAt: serverTimestamp(),
            });
            return true; // Like
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
};

export const checkIsLiked = async (
    userId: string,
    pinId: string,
): Promise<boolean> => {
    try {
        const db = getFirestore();
        const likeRef = doc(db, "pins", pinId, "likes", userId);
        const docSnap = await getDoc(likeRef);
        return docSnap.exists();
    } catch (error) {
        console.error("Error checking isLiked:", error);
        return false;
    }
};
