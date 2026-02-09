import { useRouter } from "expo-router";
import { Pin, Settings, Star, User } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileCard from "@/src/components/ProfileCard";
import { AppButton, AppCard, AppText, Divider } from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";
import { useGetUser } from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: userProfile, isLoading } = useGetUser(user?.uid);
    const insets = useSafeAreaInsets();

    return (
        <ScreenWrapper
            headerOptions={{
                showHeader: true,
                title: "Profile",
                rightIcon: (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push("/(tabs)/settings")}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Settings color="#fff" size={24} />
                    </TouchableOpacity>
                ),
            }}
            contentContainerClassName="px-4"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                <View
                    style={{ paddingTop: insets.top + 64 }}
                    className="flex-1 gap-4"
                >
                    <View className="items-center">
                        {isLoading ? (
                            <AppText>Loading...</AppText>
                        ) : (
                            <ProfileCard
                                imageOnPress={() =>
                                    router.push("/(tabs)/profile/edit-profile")
                                }
                                photoURL={userProfile?.photoURL}
                                email={userProfile?.email}
                                displayName={userProfile?.displayName}
                                userName={userProfile?.username}
                            />
                        )}
                    </View>

                    <AppCard className="rounded-3xl p-0 overflow-hidden">
                        <AppButton
                            icon={<User color="#ffffff" size={20} />}
                            onPress={() =>
                                router.push("/(tabs)/profile/edit-profile")
                            }
                            fullWidth
                            rounded="sm"
                            className="justify-start active:bg-foreground/5 p-4"
                        >
                            Edit Profile
                        </AppButton>
                    </AppCard>

                    <AppCard className="rounded-3xl p-0 overflow-hidden">
                        <AppButton
                            icon={<Pin color="#ffffff" size={20} />}
                            onPress={() =>
                                router.push("/(tabs)/profile/my-pins")
                            }
                            fullWidth
                            rounded="sm"
                            className="justify-start active:bg-foreground/5 p-4"
                        >
                            My Pins
                        </AppButton>
                        <Divider />
                        <AppButton
                            icon={<Star color="#ffffff" size={20} />}
                            onPress={() =>
                                router.push("/(tabs)/profile/saved-pins")
                            }
                            fullWidth
                            rounded="sm"
                            className="justify-start active:bg-foreground/5 p-4"
                        >
                            Saved Pins
                        </AppButton>
                    </AppCard>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
