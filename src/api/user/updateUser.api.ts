import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import type { UserProfile } from "@/src/schemas";

export const updateUser = async (
    uid: string,
    data: Partial<UserProfile>,
): Promise<void> => {
    try {
        const db = getFirestore();
        await updateDoc(doc(db, "users", uid), data);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
