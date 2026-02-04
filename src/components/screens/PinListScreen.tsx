import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PinItem from "@/src/components/PinItem";
import { AppBackButton, AppText, ScreenWrapper } from "@/src/components/ui";
import type { Pin } from "@/src/schemas";

interface PinListScreenProps {
    title: string;
    pins: Pin[] | undefined;
    isLoading: boolean;
    emptyMessage: string;
}

export default function PinListScreen({
    title,
    pins,
    isLoading,
    emptyMessage,
}: Readonly<PinListScreenProps>) {
    const insets = useSafeAreaInsets();

    return (
        <ScreenWrapper
            headerOptions={{
                title,
                showHeader: true,
                leftIcon: <AppBackButton />,
            }}
        >
            <View className="flex-1">
                {isLoading ? (
                    <View
                        className="flex-1 justify-center items-center"
                        style={{ paddingTop: insets.top + 64 }}
                    >
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <FlashList
                        data={pins}
                        masonry
                        contentContainerStyle={{
                            paddingTop: insets.top + 64,
                            paddingBottom: insets.bottom + 64,
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <PinItem item={item} />}
                        numColumns={2}
                        ListEmptyComponent={() => (
                            <View className="flex-1 justify-center items-center pt-20 px-4">
                                <AppText className="text-secondary-text text-center">
                                    {emptyMessage}
                                </AppText>
                            </View>
                        )}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
}
