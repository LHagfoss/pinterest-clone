import { useRouter } from "expo-router";
import { AppBackButton, AppText } from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";

export default function PrivacyPolicyScreen() {
    const router = useRouter();

    return (
        <ScreenWrapper
            headerOptions={{
                showHeader: true,
                title: "Privacy Policy",
                leftIcon: <AppBackButton />,
            }}
            contentContainerClassName="px-4"
        >
            <AppText className="mt-24 text-center text-secondary-text">
                Privacy Policy content goes here.
            </AppText>
        </ScreenWrapper>
    );
}
