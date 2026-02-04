import PinListScreen from "@/src/components/screens/PinListScreen";
import { useGetUserPins } from "@/src/hooks/pins/useUserPins";

export default function MyPinsScreen() {
    const { data: pins, isLoading } = useGetUserPins();

    return (
        <PinListScreen
            title="My Pins"
            pins={pins}
            isLoading={isLoading}
            emptyMessage="You haven't uploaded any pins yet."
        />
    );
}
