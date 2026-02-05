import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { uploadProfilePicture } from "@/src/api/user";
import { AppButton, AppText } from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";
import { useUpdateUser } from "@/src/hooks/user";
import { useAuthStore, useOnboardingStore } from "@/src/stores";

const CATEGORIES = [
    "Nature",
    "Technology",
    "Art",
    "Fashion",
    "Food",
    "Travel",
    "Music",
    "Sports",
    "Cars",
    "Gaming",
    "Photography",
    "Architecture",
    "Design",
    "DIY",
    "Fitness",
];

export default function OnboardingInterestsScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { mutateAsync: updateUser } = useUpdateUser();

    const {
        age,
        birthday,
        username,
        profileImageUri,
        selectedCategories,
        setSelectedCategories,
        reset,
    } = useOnboardingStore();

    const [loading, setLoading] = useState(false);

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(
                selectedCategories.filter((c) => c !== category),
            );
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleFinish = async () => {
        if (!user?.uid) return;

        if (selectedCategories.length < 3) {
            Toast.show({
                type: "error",
                text1: "Please select at least 3 interests",
            });
            return;
        }

        setLoading(true);

        try {
            let photoURL = null;

            if (profileImageUri) {
                try {
                    photoURL = await uploadProfilePicture(
                        user.uid,
                        profileImageUri,
                    );
                } catch (error) {
                    console.error("Failed to upload image:", error);
                }
            }

            const tagAffinity: Record<string, number> = {};
            selectedCategories.forEach((cat) => {
                tagAffinity[cat] = 1;
            });

            await updateUser({
                uid: user.uid,
                data: {
                    age: age || undefined,
                    birthday: birthday || undefined,
                    username: username || undefined,
                    photoURL: photoURL || undefined,
                    tagAffinity: tagAffinity,
                    isOnboardingCompleted: true,
                },
            });

            reset();
            router.replace("/(tabs)/feed");
        } catch (error) {
            console.error("Onboarding failed:", error);
            Toast.show({
                type: "error",
                text1: "Failed to complete setup",
                text2: "Please try again",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper
            className="flex-1 bg-background"
            headerOptions={{ showHeader: false }}
        >
            <View className="flex-1 pt-20">
                <View className="px-4 mb-6">
                    <AppText size="4xl" weight="bold" className="mb-2">
                        Last step!
                    </AppText>
                    <AppText className="text-secondary-text">
                        Tell us what you love so we can customize your feed.
                    </AppText>
                </View>

                <ScrollView contentContainerClassName="p-4">
                    <View className="flex-row flex-wrap gap-2">
                        {CATEGORIES.map((category) => {
                            const isSelected =
                                selectedCategories.includes(category);
                            return (
                                <TouchableOpacity
                                    key={category}
                                    onPress={() => toggleCategory(category)}
                                    className={`px-4 py-2 rounded-full border ${
                                        isSelected
                                            ? "bg-primary border-primary"
                                            : "bg-background-700 border-border"
                                    }`}
                                >
                                    <AppText
                                        className={
                                            isSelected
                                                ? "text-white"
                                                : "text-secondary-text"
                                        }
                                    >
                                        {category}
                                    </AppText>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                <View className="mb-4">
                    <AppButton
                        variant="primary"
                        className="bg-foreground"
                        textClassName="text-on-foreground"
                        onPress={handleFinish}
                        loading={loading}
                        size="lg"
                        fullWidth
                    >
                        Finish
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
