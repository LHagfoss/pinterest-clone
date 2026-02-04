import { useRouter } from "expo-router";
import { LogOut, Pin, Star } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileCard from "@/src/components/ProfileCard";
import { SeedDataButton } from "@/src/components/SeedDataButton";
import { AppButton, AppCard, AppText, Divider } from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";
import { useGetUser, useUpdateProfilePicture } from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

export default function ProfileScreen() {
    const router = useRouter();
    const { signOut, user } = useAuthStore();
    const { data: userProfile, isLoading } = useGetUser(user?.uid);
    const { pickAndUploadImage, uploading } = useUpdateProfilePicture();
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const handleGoogleLogOut = async () => {
        setLoading(true);
        try {
            await signOut();
        } catch (error: any) {
            if (error.code !== "SIGN_IN_CANCELLED" && error.code !== "-5") {
                console.error("Sign-in failed:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper
            headerOptions={{
                showHeader: true,
                title: "Profile",
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
                                imageOnPress={pickAndUploadImage}
                                photoURL={userProfile?.photoURL}
                                email={userProfile?.email}
                                displayName={userProfile?.displayName}
                                userName={userProfile?.username}
                            />
                        )}
                    </View>

                    <AppCard className="rounded-3xl p-0 overflow-hidden">
                        <AppButton
                            onPress={() =>
                                router.push("/(tabs)/profile/edit-display-name")
                            }
                            fullWidth
                            rounded="sm"
                            className="justify-start active:bg-foreground/5 p-4"
                        >
                            Change Display Name
                        </AppButton>
                        <Divider />
                        <AppButton
                            onPress={() =>
                                router.push("/(tabs)/profile/edit-username")
                            }
                            fullWidth
                            rounded="sm"
                            className="justify-start active:bg-foreground/5 p-4"
                        >
                            Change Username
                        </AppButton>
                        <Divider />
                        <AppButton
                            onPress={pickAndUploadImage}
                            loading={uploading}
                            fullWidth
                            rounded="sm"
                            className="justify-start active:bg-foreground/5 p-4"
                        >
                            Change Profile Picture
                        </AppButton>
                    </AppCard>

                    <AppCard className="rounded-3xl p-0 overflow-hidden">
                        <AppButton
                            icon={<Pin color="#ffffff" size={16} />}
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
                            icon={<Star color="#ffffff" size={16} />}
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

                    <AppCard className="rounded-3xl p-0 overflow-hidden">
                        <SeedDataButton />
                        <Divider />
                        <AppButton
                            icon={<LogOut color="#ff6666" size={16} />}
                            onPress={handleGoogleLogOut}
                            loading={loading}
                            rounded="sm"
                            fullWidth
                            className="justify-start active:bg-foreground/5 p-4"
                            textClassName="text-danger-text"
                        >
                            Log out
                        </AppButton>
                    </AppCard>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
