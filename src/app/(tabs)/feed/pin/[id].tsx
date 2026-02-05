import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import PinDetailScreen from "@/src/components/screens/PinDetailScreen";
import { useGetPin } from "@/src/hooks/pins";
import { usePinStore } from "@/src/stores";
import type { Pin } from "@/src/schemas";
import { ActivityIndicator, View } from "react-native";

export default function PinDetail() {
    const { id } = useLocalSearchParams();
    const { selectedPin } = usePinStore();
    const [pin, setPin] = useState<Pin | null>(null);

    // 1. Check if the pin is in the store (immediate)
    useEffect(() => {
        if (selectedPin && selectedPin.id === id) {
            setPin(selectedPin);
        }
    }, [selectedPin, id]);

    // 2. Fallback: Fetch from Firestore if not in store or doesn't match
    const { data: fetchedPin, isLoading } = useGetPin(pin ? undefined : (id as string));

    useEffect(() => {
        if (fetchedPin) {
            setPin(fetchedPin);
        }
    }, [fetchedPin]);

    if (isLoading && !pin) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    if (!pin) {
        return null;
    }

    return <PinDetailScreen pin={pin} />;
}