import {
    collection,
    doc,
    getFirestore,
    serverTimestamp,
    setDoc,
} from "@react-native-firebase/firestore";
import type { Pin } from "@/src/schemas";
import { getColorNameFromHex } from "@/src/utils/colors";

interface CreatePinDTO {
    id?: string;
    userId: string;
    title: string;
    description: string;
    imageUrl: string;
    width: number;
    height: number;
    ratio: number;
    dominantColor?: string;
    tags: string[];
}

export const createPin = async (data: CreatePinDTO): Promise<void> => {
    try {
        const db = getFirestore();
        const newPinRef = data.id
            ? doc(db, "pins", data.id)
            : doc(collection(db, "pins"));

        const domColor = data.dominantColor || "#000000";
        const colorName = getColorNameFromHex(domColor);
        const finalTags = [...data.tags, colorName].map((t) => t.toLowerCase());

        const pinData: Pin = {
            id: newPinRef.id,
            userId: data.userId,
            createdAt: serverTimestamp(),

            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,

            width: data.width,
            height: data.height,
            ratio: data.ratio,
            dominantColor: domColor,

            tags: finalTags,

            stats: {
                likes: 0,
                views: 0,
                clicks: 0,
                score: 0,
            },
        };

        await setDoc(newPinRef, pinData);
    } catch (error) {
        console.error("Error creating pin:", error);
        throw error;
    }
};
