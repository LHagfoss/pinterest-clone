import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PinItem from "@/src/components/PinItem";
import { AppText, ProfilePicture, ScreenWrapper } from "@/src/components/ui";
import { useFeed } from "@/src/hooks/feed/useFeed";

export default function FeedScreen() {
    const insets = useSafeAreaInsets();

    const { pins, isLoading, isRefreshing, refresh, loadMore } = useFeed();

    return (
        <ScreenWrapper
            headerOptions={{
                title: "For You",
                showHeader: true,
                rightIcon: <ProfilePicture />,
            }}
        >
            <View className="flex-1">
                <FlashList
                    data={pins}
                    masonry
                    numColumns={2}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    refreshing={isRefreshing}
                    onRefresh={refresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={refresh}
                            tintColor="#3333333"
                            progressViewOffset={insets.top + 64}
                        />
                    }
                    contentContainerStyle={{
                        paddingTop: insets.top + 64,
                        paddingBottom: insets.bottom + 64,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PinItem item={item} />}
                    ListFooterComponent={() =>
                        isLoading && !isRefreshing ? (
                            <View className="py-6">
                                <ActivityIndicator size="small" />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={() =>
                        !isLoading && (
                            <View className="flex-1 justify-center items-center pt-20">
                                <AppText className="text-gray-500">
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
