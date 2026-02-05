import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { AppButton, AppInput, AppText } from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";
import { useGetUser } from "@/src/hooks/user";
import { useAuthStore, useOnboardingStore } from "@/src/stores";

export default function OnboardingUsernameScreen() {
    const router = useRouter();
    const { setUsername, username: storedUsername } = useOnboardingStore();
    const { user } = useAuthStore();
    const { data: userProfile } = useGetUser(user?.uid);

    const [username, setLocalUsername] = useState(
        storedUsername || userProfile?.username || "",
    );

    const handleContinue = () => {
        const cleanUsername = username
            .trim()
            .toLowerCase()
            .replaceAll(/\s+/g, "");

        if (cleanUsername.length < 3) {
            Toast.show({
                type: "error",
                text1: "Username must be at least 3 characters",
            });
            return;
        }

        setUsername(cleanUsername);
        router.push("/(onboarding)/interests");
    };

    return (
        <ScreenWrapper
            className="flex-1 bg-background"
            headerOptions={{ showHeader: false }}
        >
            <View className="flex-1 p-4 pt-20 justify-between">
                <View className="gap-8">
                    <View>
                        <AppText size="4xl" weight="bold" className="mb-2">
                            Pick a username
                        </AppText>
                        <AppText className="text-secondary-text">
                            This is how you&apos;ll appear on PinClone.
                        </AppText>
                    </View>

                    <View>
                        <AppInput
                            value={username}
                            onChangeText={setLocalUsername}
                            placeholder="Username"
                            autoCapitalize="none"
                            variant="filled"
                            size="lg"
                        />
                        <AppText className="text-secondary-text text-xs mt-2 ml-1">
                            You can change this later in settings.
                        </AppText>
                    </View>
                </View>

                <View className="mb-4">
                    <AppButton
                        variant="primary"
                        className="bg-foreground"
                        textClassName="text-on-foreground"
                        onPress={handleContinue}
                        size="lg"
                        fullWidth
                        disabled={username.length < 3}
                    >
                        Next
                    </AppButton>

                    <AppButton
                        onPress={() => router.back()}
                        size="lg"
                        fullWidth
                    >
                        Back
                    </AppButton>
                </View>
            </View>
        </ScreenWrapper>
    );
}
