import { useQuery } from "@tanstack/react-query";
import { getFavorites, checkIsFavorited } from "@/src/api/favorites";
import { useAuthStore } from "@/src/stores";

export const useGetFavorites = () => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ["favorites", user?.uid],
        queryFn: async () => {
            if (!user?.uid) return [];
            return getFavorites(user.uid);
        },
        enabled: !!user?.uid,
    });
};

export const useIsFavorited = (pinId: string) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ["isFavorited", pinId],
        queryFn: async () => {
            if (!user?.uid) return false;
            return checkIsFavorited(user.uid, pinId);
        },
        enabled: !!user?.uid && !!pinId,
    });
};
