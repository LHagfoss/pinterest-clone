import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/src/api/user";
import type { UserProfile } from "@/src/schemas";

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: UserProfile) => createUser(user),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["user", variables.uid],
            });
        },
    });
};
