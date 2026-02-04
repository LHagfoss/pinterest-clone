import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavorite } from "@/src/api/favorites";
import { useAuthStore } from "@/src/stores";
import type { Pin } from "@/src/schemas";
import Toast from "react-native-toast-message";

export const useToggleFavorite = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pin: Pin) => {
            if (!user?.uid) throw new Error("User not logged in");
            return toggleFavorite(user.uid, pin);
        },
        onMutate: async (pin: Pin) => {
            await queryClient.cancelQueries({ queryKey: ["isFavorited", pin.id] });
            const previousState = queryClient.getQueryData<boolean>(["isFavorited", pin.id]);
            
            // Optimistically flip the state
            queryClient.setQueryData(["isFavorited", pin.id], (old: boolean | undefined) => !old);
            
            return { previousState };
        },
        onError: (err, pin, context) => {
            // Rollback on error
            if (context?.previousState !== undefined) {
                queryClient.setQueryData(["isFavorited", pin.id], context.previousState);
            }
            Toast.show({
                type: "error",
                text1: "Failed to update favorite",
            });
        },
        onSettled: (data, error, pin) => {
            queryClient.invalidateQueries({ queryKey: ["isFavorited", pin.id] });
            queryClient.invalidateQueries({ queryKey: ["favorites", user?.uid] });
        },
        onSuccess: (isFavorited) => {
             Toast.show({
                type: "success",
                text1: isFavorited ? "Saved to your profile!" : "Removed from saved pins",
            });
        }
    });
};
