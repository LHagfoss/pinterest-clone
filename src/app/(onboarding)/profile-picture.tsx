import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { AppButton, AppText } from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";
import { useOnboardingStore } from "@/src/stores";

export default function OnboardingProfilePictureScreen() {
    const router = useRouter();
    const { setProfileImageUri, profileImageUri } = useOnboardingStore();
    const [image, setImage] = useState<string | null>(profileImageUri);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
        }
    };

    const handleContinue = () => {
        setProfileImageUri(image);
        router.push("/(onboarding)/username");
    };

    return (
        <ScreenWrapper
            className="flex-1 bg-background"
            headerOptions={{ showHeader: false }}
        >
            <View className="flex-1 p-4 pt-20 justify-between">
                <View className="gap-8">
                    <View>
                        <AppText size="3xl" weight="bold" className="mb-2">
                            Add a photo
                        </AppText>
                        <AppText className="text-secondary-text">
                            Help others recognize you. You can change this
                            later.
                        </AppText>
                    </View>

                    <View className="items-center mt-8">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={pickImage}
                            className="relative"
                        >
                            <View className="h-44 w-44 rounded-full overflow-hidden bg-background-700 border border-border">
                                {image ? (
                                    <Image
                                        source={{ uri: image }}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View className="flex-1 items-center justify-center bg-background-800">
                                        <AppText className="text-4xl font-bold uppercase text-foreground">
                                            +
                                        </AppText>
                                    </View>
                                )}
                            </View>
                            <View className="absolute bottom-1 right-1 rounded-full overflow-hidden h-12 w-12">
                                <BlurView
                                    className="w-full h-full items-center justify-center"
                                    intensity={40}
                                >
                                    <Camera size={24} color="#fff" />
                                </BlurView>
                            </View>
                        </TouchableOpacity>
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
                    >
                        {image ? "Next" : "Skip"}
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
