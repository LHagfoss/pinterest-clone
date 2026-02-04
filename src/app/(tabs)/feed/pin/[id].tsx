import { useLocalSearchParams } from "expo-router";
import PinDetailScreen from "@/src/components/screens/PinDetailScreen";
import type { Pin } from "@/src/schemas";

export default function PinDetail() {
    const { pin: pinString } = useLocalSearchParams();
    const pin: Pin = pinString ? JSON.parse(pinString as string) : null;

    if (!pin) {
        return null;
    }

    return <PinDetailScreen pin={pin} />;
}
