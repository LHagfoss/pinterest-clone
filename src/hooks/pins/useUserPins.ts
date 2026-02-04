import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserPins, deletePin } from "@/src/api/pins";
import { useAuthStore } from "@/src/stores";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export const useGetUserPins = () => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ["userPins", user?.uid],
        queryFn: async () => {
            if (!user?.uid) return [];
            return getUserPins(user.uid);
        },
        enabled: !!user?.uid,
    });
};

export const useDeletePin = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: deletePin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
            queryClient.invalidateQueries({ queryKey: ["userPins", user?.uid] });
            Toast.show({
                type: "success",
                text1: "Pin deleted successfully",
            });
            router.back();
        },
        onError: () => {
            Toast.show({
                type: "error",
                text1: "Failed to delete pin",
            });
        },
    });
};
