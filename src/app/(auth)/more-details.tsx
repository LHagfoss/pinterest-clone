import { useRouter } from "expo-router";
import { View } from "react-native";
import { AppButton } from "@/src/components/ui";
import { AppText } from "@/src/components/ui/AppText";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";

export default function MoreDetailsScreen() {
    const router = useRouter();

    return (
        <ScreenWrapper
            paddingTop={false}
            className="px-8 pt-8 bg-dark-background"
        >
            <View className="flex-row items-center justify-between">
                <AppText
                    size="xl"
                    weight="bold"
                    className="text-primary-text mb-4"
                >
                    PinClone made by LHagfoss
                </AppText>
            </View>
            <AppText className="text-secondary-text mb-8">
                This app was inspiried by Pinterest. I made this app so I could
                learn modern technologies and create something that is used in
                the real world.
            </AppText>

            <AppButton
                variant="primary"
                fullWidth
                size="md"
                className="bg-secondary"
                onPress={() => router.back()}
                hitSlop={8}
            >
                Close
            </AppButton>
        </ScreenWrapper>
    );
}
