import { doc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import type { UserProfile } from "@/src/schemas";

export const createUser = async (user: UserProfile): Promise<void> => {
    try {
        const db = getFirestore();
        await setDoc(doc(db, "users", user.uid), user);
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
