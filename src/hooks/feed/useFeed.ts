import { useCallback, useEffect, useState } from "react";
import { getFeed } from "@/src/api/feed";
import type { Pin } from "@/src/schemas";
import { useAuthStore } from "@/src/stores";

export const useFeed = () => {
    const { user } = useAuthStore();
    const [pins, setPins] = useState<Pin[]>([]);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchPins = useCallback(
        async (isRefresh = false) => {
            if (isLoading || (!hasMore && !isRefresh)) return;

            setIsLoading(true);

            // If refreshing, reset cursor to null (start over)
            const cursor = isRefresh ? null : lastVisible;

            try {
                const { pins: newPins, lastVisible: newCursor } = await getFeed(
                    user,
                    cursor,
                );

                if (isRefresh) {
                    setPins(newPins);
                } else {
                    // Filter out duplicates just in case
                    setPins((prev) => {
                        const existingIds = new Set(prev.map((p) => p.id));
                        const uniqueNew = newPins.filter(
                            (p) => !existingIds.has(p.id),
                        );
                        return [...prev, ...uniqueNew];
                    });
                }

                setLastVisible(newCursor);

                // If we got fewer than 5 pins, we probably ran out of data
                if (newPins.length < 5) setHasMore(false);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [user, lastVisible, isLoading, hasMore],
    );

    useEffect(() => {
        fetchPins(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.uid]);

    const refresh = () => {
        setIsRefreshing(true);
        setHasMore(true);
        fetchPins(true);
    };

    const loadMore = () => {
        fetchPins(false);
    };

    return {
        pins,
        isLoading,
        isRefreshing,
        refresh,
        loadMore,
        hasMore,
    };
};
