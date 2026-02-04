import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, subscribeToUser } from "@/src/api/user";
import { useEffect } from "react";
import type { UserProfile } from "@/src/schemas";

export const useGetUser = (uid: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = subscribeToUser(uid, (data) => {
      queryClient.setQueryData(["user", uid], data);
    });

    return () => {
      unsubscribe();
    };
  }, [uid, queryClient]);

  return useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      if (!uid) return null;
      return getUser(uid);
    },
    enabled: !!uid,
  });
};
