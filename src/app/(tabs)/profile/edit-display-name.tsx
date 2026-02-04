import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { AppButton, AppInput, AppText } from "@/src/components/ui";
import { useGetUser, useUpdateUser } from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

export default function EditDisplayNameScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: userProfile } = useGetUser(user?.uid);
    const { mutateAsync: updateUser, isPending } = useUpdateUser();

    const [displayName, setDisplayName] = useState(
        userProfile?.displayName || "",
    );

    const handleSave = async () => {
        if (!user?.uid) return;
        try {
            await updateUser({ uid: user.uid, data: { displayName } });
            Toast.show({
                type: "success",
                text1: "Display name updated",
            });
            router.back();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to update display name",
            });
        }
    };

    return (
        <View className="bg-dark-background px-4 pt-8">
            <AppText size="2xl" weight="bold" className="text-primary-text">
                Display Name
            </AppText>

            <AppText className="text-secondary-text mb-2">
                This name will be visible to other users on your profile.
            </AppText>

            <AppInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter display name"
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
                    !displayName.trim() ||
                    displayName === userProfile?.displayName
                }
            >
                Save
            </AppButton>
        </View>
    );
}
