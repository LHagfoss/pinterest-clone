import { useRouter } from "expo-router";
import { AppBackButton, AppText } from "@/src/components/ui";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";

export default function TermsOfServiceScreen() {
    const router = useRouter();

    return (
        <ScreenWrapper
            headerOptions={{
                showHeader: true,
                title: "Terms of Service",
                leftIcon: <AppBackButton />,
            }}
            contentContainerClassName="px-4"
        >
             <AppText className="mt-24 text-center text-secondary-text">
                Terms of Service content goes here.
            </AppText>
        </ScreenWrapper>
    );
}
