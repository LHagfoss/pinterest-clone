import { useQuery } from "@tanstack/react-query";
import { getRecommendedPins } from "@/src/api/pins/getRecommendedPins.api";
import { useAuthStore } from "@/src/stores";

export const useGetRecommendedPins = (tags: string[], currentPinId?: string) => {
    const { user } = useAuthStore();

    return useQuery({
        // Include tags and currentPinId in queryKey so it refetches when they change
        queryKey: ["recommendedPins", currentPinId, tags],
        queryFn: () => getRecommendedPins(tags, currentPinId),
        enabled: !!user?.uid,
    });
};
