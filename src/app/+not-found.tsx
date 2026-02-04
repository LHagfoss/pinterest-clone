import { Link, Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { AppButton, AppText, ScreenWrapper } from "@/src/components/ui";

export default function NotFoundScreen() {
    const router = useRouter();

    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <ScreenWrapper contentContainerClassName="flex-1 items-center justify-center">
                <AppText weight="bold" size="3xl">
                    Sorry
                </AppText>

                <AppText className="mb-4">
                    This screen doesn&apos;t exist.
                </AppText>

                <AppButton
                    onPress={() => router.replace("/(tabs)/feed")}
                    fullWidth
                    size="lg"
                    variant="primary"
                    className="bg-foreground"
                >
                    <Text className="text-background font-semibold">
                        Go Home
                    </Text>
                </AppButton>
            </ScreenWrapper>
        </>
    );
}
