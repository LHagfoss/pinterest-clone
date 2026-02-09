import Constants from "expo-constants";
import { useRouter } from "expo-router";
import {
    FileText,
    Info,
    LogOut,
    Mail,
    Server,
    Trash2,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { SeedDataButton } from "@/src/components/SeedDataButton";
import {
    AppBackButton,
    AppButton,
    AppCard,
    AppText,
    Divider,
} from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";
import { useGetUser } from "@/src/hooks/user";
import { useDeleteUser } from "@/src/hooks/user/useDeleteUser";
import { useAuthStore } from "@/src/stores";

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut, user } = useAuthStore();
    const { data: userProfile } = useGetUser(user?.uid);
    const { mutateAsync: deleteUserAccount, isPending: isDeleting } =
        useDeleteUser();
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const handleLogOut = async () => {
        setLoading(true);
        try {
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch (error: any) {
            if (error.code !== "SIGN_IN_CANCELLED" && error.code !== "-5") {
                console.error("Sign-in failed:", error);
                Toast.show({
                    type: "error",
                    text1: "Failed to log out",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (!user?.uid) return;
                        try {
                            await deleteUserAccount(user.uid);
                            await user.delete();

                            Toast.show({
                                type: "success",
                                text1: "Account deleted",
                            });
                            router.replace("/(auth)/sign-in");
                        } catch (error: any) {
                            console.error("Delete account failed:", error);
                            if (error.code === "auth/requires-recent-login") {
                                Toast.show({
                                    type: "error",
                                    text1: "Please log in again to delete your account",
                                });
                                await signOut();
                                router.replace("/(auth)/sign-in");
                            } else {
                                Toast.show({
                                    type: "error",
                                    text1: "Failed to delete account",
                                });
                            }
                        }
                    },
                },
            ],
        );
    };

    return (
        <ScreenWrapper
            headerOptions={{
                showHeader: true,
                title: "Settings",
            }}
            contentContainerClassName="px-4"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            >
                <View style={{ paddingTop: insets.top + 64 }} className="gap-6">
                    <View>
                        <AppText
                            size="xs"
                            weight="bold"
                            className="text-secondary-text mb-2 ml-1 uppercase"
                        >
                            Account
                        </AppText>
                        <AppCard className="rounded-3xl p-0 overflow-hidden">
                            <View className="flex-row items-center justify-between p-4 bg-background/5">
                                <View className="flex-row items-center gap-3">
                                    <Mail color="#ffffff" size={20} />
                                    <View>
                                        <AppText className="font-medium">
                                            Email
                                        </AppText>
                                        <AppText className="text-secondary-text text-sm">
                                            {userProfile?.email ||
                                                user?.email ||
                                                "No email"}
                                        </AppText>
                                    </View>
                                </View>
                            </View>
                        </AppCard>
                    </View>

                    <View>
                        <AppText
                            size="xs"
                            weight="bold"
                            className="text-secondary-text mb-2 ml-1 uppercase"
                        >
                            Legal
                        </AppText>
                        <AppCard className="rounded-3xl p-0 overflow-hidden">
                            <AppButton
                                icon={<FileText color="#ffffff" size={20} />}
                                onPress={() =>
                                    router.push(
                                        "/(tabs)/settings/terms-of-service",
                                    )
                                }
                                fullWidth
                                rounded="sm"
                                className="justify-start active:bg-foreground/5 p-4"
                            >
                                Terms of Service
                            </AppButton>
                            <Divider />
                            <AppButton
                                icon={<Info color="#ffffff" size={20} />}
                                onPress={() =>
                                    router.push(
                                        "/(tabs)/settings/privacy-policy",
                                    )
                                }
                                fullWidth
                                rounded="sm"
                                className="justify-start active:bg-foreground/5 p-4"
                            >
                                Privacy Policy
                            </AppButton>
                        </AppCard>
                    </View>

                    <View>
                        <AppText
                            size="xs"
                            weight="bold"
                            className="text-secondary-text mb-2 ml-1 uppercase"
                        >
                            Developer
                        </AppText>
                        <AppCard className="rounded-3xl p-0 overflow-hidden">
                            <SeedDataButton
                                icon={<Server color="#ffffff" size={20} />}
                            />
                        </AppCard>
                    </View>

                    <View>
                        <AppText
                            size="xs"
                            weight="bold"
                            className="text-secondary-text mb-2 ml-1 uppercase"
                        >
                            Actions
                        </AppText>
                        <AppCard className="rounded-3xl p-0 overflow-hidden">
                            <AppButton
                                icon={<LogOut color="#ffffff" size={20} />}
                                onPress={handleLogOut}
                                loading={loading}
                                fullWidth
                                rounded="sm"
                                className="justify-start active:bg-foreground/5 p-4"
                            >
                                Log out
                            </AppButton>
                            <Divider />
                            <AppButton
                                icon={<Trash2 color="#ff6666" size={20} />}
                                onPress={handleDeleteAccount}
                                loading={isDeleting}
                                fullWidth
                                rounded="sm"
                                className="justify-start active:bg-foreground/5 p-4"
                                textClassName="text-danger-text"
                            >
                                Delete Account
                            </AppButton>
                        </AppCard>
                    </View>

                    <View className="items-center py-4">
                        <AppText className="text-secondary-text text-xs">
                            Version {Constants.expoConfig?.version}
                        </AppText>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
