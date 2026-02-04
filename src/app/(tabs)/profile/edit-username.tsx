import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { AppButton, AppInput, AppText } from "@/src/components/ui";
import { useGetUser, useUpdateUser } from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

export default function EditUsernameScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: userProfile } = useGetUser(user?.uid);
    const { mutateAsync: updateUser, isPending } = useUpdateUser();

    const [username, setUsername] = useState(userProfile?.username || "");

    const handleSave = async () => {
        if (!user?.uid) return;
        const cleanUsername = username
            .trim()
            .toLowerCase()
            .replaceAll(/\s+/g, "");

        try {
            await updateUser({
                uid: user.uid,
                data: { username: cleanUsername },
            });
            Toast.show({
                type: "success",
                text1: "Username updated",
            });
            router.back();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to update username",
            });
        }
    };

    return (
        <View className="bg-dark-background px-4 pt-8">
            <AppText size="2xl" weight="bold" className="text-primary-text">
                Username
            </AppText>

            <AppText className="text-secondary-text mb-2">
                Choose a unique username for your profile.
            </AppText>

            <AppInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                autoCapitalize="none"
                autoFocus
                variant="filled"
                size="lg"
                rounded="lg"
                className="mb-6"
            />

            <AppButton
                onPress={handleSave}
                loading={isPending}
                fullWidth
                size="lg"
                className="bg-foreground"
                textClassName="text-foreground-text"
                disabled={
                    !username.trim() || username === userProfile?.username
                }
            >
                Save
            </AppButton>
        </View>
    );
}
