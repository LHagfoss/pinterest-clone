import { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { createPin } from "@/src/api/pins";
import { AppButton, AppCard } from "@/src/components/ui";
import { masonryData } from "@/src/constants/data/masonryData";
import { useAuthStore } from "@/src/stores";

export function SeedDataButton() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    const handleSeed = async () => {
        if (!user?.uid) {
            Toast.show({ type: "error", text1: "Please log in first" });
            return;
        }

        setLoading(true);
        try {
            let count = 0;

            for (const pin of masonryData) {
                await createPin({
                    userId: user.uid,
                    title: pin.title,
                    description: pin.description,
                    imageUrl: pin.imageUrl,
                    width: pin.width,
                    height: pin.height,
                    ratio: pin.ratio,
                    tags: pin.tags || [],
                    blurhash: pin.blurhash,
                });
                count++;
            }
            Toast.show({ type: "success", text1: `Seeded ${count} pins!` });
        } catch (error) {
            console.error(error);
            Toast.show({ type: "error", text1: "Failed to seed data" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppButton
            onPress={handleSeed}
            loading={loading}
            fullWidth
            variant="secondary"
            className="justify-start active:bg-foreground/5 p-4"
            rounded="sm"
        >
            Seed Dummy Data (Dev Only)
        </AppButton>
    );
}
