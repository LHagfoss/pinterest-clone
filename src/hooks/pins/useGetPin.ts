import { useQuery } from "@tanstack/react-query";
import { getPin } from "@/src/api/pins";

export const useGetPin = (id: string | undefined) => {
    return useQuery({
        queryKey: ["pin", id],
        queryFn: () => (id ? getPin(id) : null),
        enabled: !!id,
    });
};
