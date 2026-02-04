import { useQuery } from "@tanstack/react-query";
import { getPins } from "@/src/api/pins";
import { useAuthStore } from "@/src/stores";

export const useGetPins = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ["pins"],
        queryFn: getPins,
        enabled: !!user?.uid,
    });
};
