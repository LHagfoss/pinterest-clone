import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkIsLiked, toggleLike } from "@/src/api/likes";
import { useAuthStore } from "@/src/stores";
import Toast from "react-native-toast-message";

export const useIsLiked = (pinId: string) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ["isLiked", pinId],
        queryFn: async () => {
            if (!user?.uid) return false;
            return checkIsLiked(user.uid, pinId);
        },
        enabled: !!user?.uid && !!pinId,
    });
};

export const useToggleLike = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pinId: string) => {
            if (!user?.uid) throw new Error("User not logged in");
            return toggleLike(user.uid, pinId);
        },
        onMutate: async (pinId: string) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["isLiked", pinId] });

            // Snapshot the previous value
            const previousState = queryClient.getQueryData<boolean>(["isLiked", pinId]);

            // Optimistically update to the new value
            queryClient.setQueryData(["isLiked", pinId], (old: boolean | undefined) => !old);

            // Return a context object with the snapshotted value
            return { previousState };
        },
        onError: (err, pinId, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousState !== undefined) {
                queryClient.setQueryData(["isLiked", pinId], context.previousState);
            }
            Toast.show({
                type: "error",
                text1: "Failed to like pin",
            });
        },
        onSettled: (data, error, pinId) => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ["isLiked", pinId] });
        },
        onSuccess: (isLiked) => {
             // Optional: Show toast or feedback
             // Toast.show({ type: 'success', text1: isLiked ? "Liked!" : "Unliked" });
        }
    });
};
