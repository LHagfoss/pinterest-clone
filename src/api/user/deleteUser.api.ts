import { deleteDoc, doc, getFirestore } from "@react-native-firebase/firestore";

export const deleteUser = async (uid: string): Promise<void> => {
    try {
        const db = getFirestore();
        await deleteDoc(doc(db, "users", uid));
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
