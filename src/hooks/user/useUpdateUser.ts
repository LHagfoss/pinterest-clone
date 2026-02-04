import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/src/api/user";
import type { UserProfile } from "@/src/schemas";

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            uid,
            data,
        }: {
            uid: string;
            data: Partial<UserProfile>;
        }) => updateUser(uid, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["user", variables.uid],
            });
        },
    });
};
