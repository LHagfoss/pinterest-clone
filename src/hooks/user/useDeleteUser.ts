import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/src/api/user/deleteUser.api";

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (uid: string) => deleteUser(uid),
        onSuccess: () => {
            // Invalidate user queries or perform cleanup
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};
