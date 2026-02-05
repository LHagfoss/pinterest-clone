import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PinItem from "@/src/components/PinItem";
import { AppText, ProfilePicture, ScreenWrapper } from "@/src/components/ui";
import { useFeed } from "@/src/hooks/feed/useFeed";
import { useGetUser } from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

export default function FeedScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();
    const { data: userProfile } = useGetUser(user?.uid);

    const { pins, isLoading, isRefreshing, refresh, loadMore } = useFeed();
    const [selectedFilter, setSelectedFilter] = useState("All");

    const baseFilters = ["All", "Popular", "Recent", "Following"];
    const userCategories = userProfile?.tagAffinity
        ? Object.keys(userProfile.tagAffinity)
        : [];

    const filters = [...baseFilters, ...userCategories];

    return (
        <ScreenWrapper
            headerOptions={{
                title: "For You",
                showHeader: true,
                rightIcon: <ProfilePicture />,
            }}
            contentContainerClassName="px-0"
        >
            <View className="flex-1">
                <FlashList
                    data={pins}
                    masonry
                    numColumns={2}
                    ListHeaderComponent={() => (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="p-2"
                        >
                            {filters.map((item) => {
                                const active = selectedFilter === item;
                                return (
                                    <Pressable
                                        key={item}
                                        onPress={() => setSelectedFilter(item)}
                                        className={`px-4 py-1 mr-2 rounded-full ${
                                            active
                                                ? "bg-primary"
                                                : "bg-secondary"
                                        }`}
                                    >
                                        <AppText className="text-primary-text">
                                            {item}
                                        </AppText>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    )}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    refreshing={isRefreshing}
                    onRefresh={refresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={refresh}
                            tintColor="#ffffff"
                            progressViewOffset={insets.top + 100}
                        />
                    }
                    contentContainerStyle={{
                        paddingTop: insets.top + 54,
                        paddingBottom: insets.bottom + 100,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PinItem item={item} />}
                    ListFooterComponent={() =>
                        isLoading && !isRefreshing ? (
                            <View className="py-6">
                                <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={() =>
                        !isLoading && (
                            <View className="flex-1 justify-center items-center pt-20 px-4">
                                <AppText className="text-secondary-text text-center">
                                    No pins yet. Be the first to create one!
                                </AppText>
                            </View>
                        )
                    }
                />
            </View>
        </ScreenWrapper>
    );
}
