import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";
import {
    AppBackButton,
    AppButton,
    AppInput,
    AppText,
} from "@/src/components/ui";
import {
    useGetUser,
    useUpdateProfilePicture,
    useUpdateUser,
} from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: userProfile } = useGetUser(user?.uid);
    const { mutateAsync: updateUser, isPending } = useUpdateUser();
    const { pickAndUploadImage, uploading } = useUpdateProfilePicture();

    const [displayName, setDisplayName] = useState(
        userProfile?.displayName || "",
    );
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
                data: {
                    displayName: displayName.trim(),
                    username: cleanUsername,
                },
            });
            Toast.show({
                type: "success",
                text1: "Profile updated",
            });
            router.back();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: `Failed to update profile: ${error}`,
            });
        }
    };

    const hasChanges =
        displayName.trim() !== userProfile?.displayName ||
        username.trim() !== userProfile?.username;

    return (
        <KeyboardAwareScrollView
            className="flex-1"
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
            }}
            bottomOffset={62}
        >
            <View
                collapsable={false}
                className="flex-row items-center justify-between p-4 z-20 w-full"
            >
                <AppBackButton />
                <AppText weight="bold" size="lg">
                    Edit Profile
                </AppText>
                <View className="w-10 h-10">
                    <AppButton
                        onPress={handleSave}
                        loading={isPending}
                        variant="ghost"
                        className="h-10"
                        disabled={!hasChanges}
                        textClassName={
                            hasChanges
                                ? "text-primary font-bold"
                                : "text-secondary-text"
                        }
                    >
                        Done
                    </AppButton>
                </View>
            </View>

            <View className="items-center mb-8">
                <TouchableOpacity
                    onPress={pickAndUploadImage}
                    disabled={uploading}
                    activeOpacity={0.8}
                    className="relative"
                >
                    <View className="h-32 w-32 rounded-full overflow-hidden bg-background-700 border border-border">
                        {userProfile?.photoURL ? (
                            <Image
                                source={{ uri: userProfile.photoURL }}
                                style={{ width: "100%", height: "100%" }}
                                contentFit="cover"
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center bg-background-800">
                                <AppText className="text-2xl font-bold uppercase text-foreground">
                                    {userProfile?.displayName?.[0] ||
                                        userProfile?.email?.[0] ||
                                        "?"}
                                </AppText>
                            </View>
                        )}
                        {uploading && (
                            <View className="absolute inset-0 bg-black/50 items-center justify-center">
                                <AppText className="text-white text-xs">
                                    Uploading...
                                </AppText>
                            </View>
                        )}
                    </View>

                    <View className="absolute bottom-1 right-1 rounded-full overflow-hidden h-10 w-10">
                        <BlurView
                            className="w-full h-full items-center justify-center"
                            intensity={40}
                        >
                            <Camera size={24} color="#fff" />
                        </BlurView>
                    </View>
                </TouchableOpacity>
            </View>

            <View className="gap-6">
                <View>
                    <AppText className="text-secondary-text mb-2 ml-1 text-sm">
                        Display Name
                    </AppText>
                    <AppInput
                        value={displayName}
                        onChangeText={setDisplayName}
                        placeholder="Enter display name"
                        variant="filled"
                        size="lg"
                        rounded="lg"
                    />
                </View>

                <View>
                    <AppText className="text-secondary-text mb-2 ml-1 text-sm">
                        Username
                    </AppText>
                    <AppInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter username"
                        autoCapitalize="none"
                        variant="filled"
                        size="lg"
                        rounded="lg"
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
