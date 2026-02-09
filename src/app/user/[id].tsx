import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Share2 } from "lucide-react-native";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PinItem from "@/src/components/PinItem";
import {
    AppBackButton,
    AppButton,
    AppText,
    ScreenWrapper,
} from "@/src/components/ui";
import { useGetUserPins } from "@/src/hooks/pins/useUserPins";
import { useGetUser } from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user: currentUser } = useAuthStore();

    const { data: user, isLoading: isUserLoading } = useGetUser(id as string);
    const { data: pins, isLoading: isPinsLoading } = useGetUserPins(
        id as string,
    );

    const isOwnProfile = currentUser?.uid === id;

    if (isUserLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    if (!user) {
        return (
            <ScreenWrapper
                headerOptions={{
                    showHeader: true,
                    title: "User not found",
                    leftIcon: <AppBackButton />,
                }}
            >
                <View className="flex-1 justify-center items-center">
                    <AppText>User not found</AppText>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper
            headerOptions={{
                showHeader: true,
                leftIcon: <AppBackButton />,
                rightIcon: (
                    <TouchableOpacity className="w-10 h-10 items-center justify-center">
                        <Share2 color="white" size={20} />
                    </TouchableOpacity>
                ),
            }}
            contentContainerClassName="px-0"
        >
            <FlashList
                data={pins}
                masonry
                numColumns={2}
                contentContainerStyle={{
                    paddingTop: insets.top + 60,
                    paddingBottom: insets.bottom + 64,
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <PinItem item={item} />}
                ListHeaderComponent={() => (
                    <View className="mb-8 items-center px-4">
                        {/* Profile Image */}
                        <View className="h-32 w-32 rounded-full overflow-hidden bg-background-700 mb-4 border-2 border-border/20">
                            {user.photoURL ? (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={{ width: "100%", height: "100%" }}
                                    contentFit="cover"
                                />
                            ) : (
                                <View className="flex-1 items-center justify-center bg-background-800">
                                    <AppText className="text-4xl font-bold uppercase text-foreground">
                                        {user.displayName?.[0] ||
                                            user.email?.[0] ||
                                            "?"}
                                    </AppText>
                                </View>
                            )}
                        </View>
                        {/* Name & Username */}
                        <AppText
                            size="3xl"
                            weight="bold"
                            className="text-primary-text text-center"
                        >
                            {user.displayName || "User"}
                        </AppText>
                        <AppText className="text-secondary-text text-base mt-1">
                            @{user.username || "username"}
                        </AppText>
                        {/* Stats */}
                        <View className="flex-row gap-4 mt-4">
                            <TouchableOpacity className="flex-row gap-1">
                                <AppText weight="bold">0</AppText>
                                <AppText className="text-secondary-text">
                                    followers
                                </AppText>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row gap-1">
                                <AppText weight="bold">0</AppText>
                                <AppText className="text-secondary-text">
                                    following
                                </AppText>
                            </TouchableOpacity>
                        </View>
                        {/* Bio */}
                        {user.bio && (
                            <AppText className="text-primary-text text-center mt-4 px-8 leading-5">
                                {user.bio}
                            </AppText>
                        )}
                        {/* Action Buttons */}
                        <View className="max-w-64 flex-row gap-3 mt-6">
                            {isOwnProfile ? (
                                <AppButton
                                    variant="primary"
                                    size="sm"
                                    onPress={() =>
                                        router.push(
                                            "/(tabs)/profile/edit-profile",
                                        )
                                    }
                                >
                                    Edit Profile
                                </AppButton>
                            ) : (
                                <>
                                    <AppButton variant="primary" size="sm" flex>
                                        Follow
                                    </AppButton>
                                    <AppButton variant="ghost" size="sm" flex>
                                        Message
                                    </AppButton>
                                </>
                            )}
                        </View>
                        <View className="w-full items-center mt-10">
                            <View className="border-b-2 border-primary pb-2 px-2">
                                <AppText weight="bold">Created</AppText>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={() =>
                    !isPinsLoading && (
                        <View className="flex-1 justify-center items-center pt-20 px-4">
                            <AppText className="text-secondary-text text-center">
                                No pins created yet.
                            </AppText>
                        </View>
                    )
                }
            />
        </ScreenWrapper>
    );
}
