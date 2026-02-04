import { doc, getDoc, getFirestore, onSnapshot } from "@react-native-firebase/firestore";
import type { UserProfile } from "@/src/schemas";

export const getUser = async (uid: string): Promise<UserProfile | null> => {
    try {
        const db = getFirestore();
        const documentSnapshot = await getDoc(doc(db, "users", uid));
        
        if (documentSnapshot.exists) {
            return documentSnapshot.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const subscribeToUser = (
    uid: string,
    onUpdate: (user: UserProfile | null) => void
): (() => void) => {
    const db = getFirestore();
    return onSnapshot(
        doc(db, "users", uid),
        (documentSnapshot) => {
            if (documentSnapshot.exists) {
                onUpdate(documentSnapshot.data() as UserProfile);
            } else {
                onUpdate(null);
            }
        },
        (error) => {
            console.error("Error listening to user:", error);
        }
    );
};
