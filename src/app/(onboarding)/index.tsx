import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { AppButton, AppText } from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";
import { useOnboardingStore } from "@/src/stores";

export default function OnboardingAgeScreen() {
    const router = useRouter();
    const { setAge, setBirthday } = useOnboardingStore();

    const [birthday, setLocalBirthday] = useState(
        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    );
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || birthday;
        if (Platform.OS === "android") {
            setShowDatePicker(false);
        }
        setLocalBirthday(currentDate);
    };

    const calculateAge = (birthDate: Date) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleContinue = () => {
        const ageNum = calculateAge(birthday);
        if (ageNum < 13) {
            Toast.show({
                type: "error",
                text1: "You must be at least 13 years old",
            });
            return;
        }

        setAge(ageNum);
        setBirthday(birthday.toISOString());

        router.push("/(onboarding)/profile-picture");
    };

    return (
        <ScreenWrapper
            className="flex-1 bg-background"
            headerOptions={{ showHeader: false }}
        >
            <ScrollView contentContainerClassName="flex-1 p-4 gap-8 pt-20">
                <View>
                    <AppText size="4xl" weight="bold" className="mb-2">
                        Welcome!
                    </AppText>
                    <AppText className="text-secondary-text">
                        Let&apos;s start with your birthday to personalize your
                        experience.
                    </AppText>
                </View>

                <View className="flex-1 gap-4">
                    <AppText weight="bold" size="lg">
                        When were you born?
                    </AppText>

                    {Platform.OS === "android" && (
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="bg-background-700 p-4 rounded-xl border border-border"
                        >
                            <AppText className="text-foreground">
                                {birthday.toLocaleDateString()}
                            </AppText>
                        </TouchableOpacity>
                    )}

                    {showDatePicker && (
                        <View className="items-center">
                            <DateTimePicker
                                value={birthday}
                                mode="date"
                                display="spinner"
                                locale="en-GB"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                                textColor="white"
                                style={{ height: 180, width: "100%" }}
                            />
                        </View>
                    )}
                </View>

                <View className="mb-4">
                    <AppButton
                        variant="primary"
                        onPress={handleContinue}
                        size="lg"
                        fullWidth
                        className="mt-4 bg-foreground"
                        textClassName="text-on-foreground-text"
                    >
                        Next
                    </AppButton>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
