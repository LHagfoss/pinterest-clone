import PinListScreen from "@/src/components/screens/PinListScreen";
import { useGetFavorites } from "@/src/hooks/favorites";

export default function SavedPinsScreen() {
    const { data: favorites, isLoading } = useGetFavorites();

    return (
        <PinListScreen
            title="Saved Pins"
            pins={favorites}
            isLoading={isLoading}
            emptyMessage="You haven't saved any pins yet. Tap the heart icon on a pin to save it!"
        />
    );
}
