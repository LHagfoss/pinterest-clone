import { FlashList } from "@shopify/flash-list";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PinItem from "@/src/components/PinItem";
import { AppText, ProfilePicture, ScreenWrapper } from "@/src/components/ui";
import { useFeed } from "@/src/hooks/feed/useFeed";

export default function FeedScreen() {
    const insets = useSafeAreaInsets();

    const { pins, isLoading, isRefreshing, refresh, loadMore } = useFeed();

    return (
        <ScreenWrapper contentContainerClassName="px-0">
            <View className="flex-1">
                <FlashList
                    data={pins}
                    masonry
                    numColumns={2}
                    ListHeaderComponent={() => (
                        <View className="flex-row items-end justify-between pl-4 pr-1 pb-1">
                            <Pressable className="flex-col items-center mb-1">
                                <AppText
                                    size="lg"
                                    className="text-primary-text"
                                >
                                    All
                                </AppText>

                                <View className="w-full h-0.5 bg-foreground" />
                            </Pressable>

                            <ProfilePicture />
                        </View>
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
                            progressViewOffset={insets.top}
                        />
                    }
                    contentContainerStyle={{
                        paddingTop: insets.top,
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
