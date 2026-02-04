import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Chrome } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppText } from "@/src/components/ui/AppText";
import { ScreenWrapper } from "@/src/components/ui/ScreenWrapper";
import { useAuthStore } from "@/src/stores";

export default function SignInScreen() {
    const router = useRouter();
    const { signInWithGoogle } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (error: any) {
            if (error.code !== "SIGN_IN_CANCELLED" && error.code !== "-5") {
                console.error("Sign-in failed:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const version = Constants.expoConfig?.version;

    return (
        <ScreenWrapper className="flex-1 bg-background">
            <View className="flex-1 justify-center">
                <View className="flex-1 justify-center items-center">
                    <View className="flex-row items-center gap-4 justify-center">
                        <View className="w-14 h-14 bg-primary rounded-full items-center justify-center mb-4">
                            <AppText className="text-primary-text font-bold text-2xl">
                                P
                            </AppText>
                        </View>
                        <AppText
                            size="5xl"
                            weight="bold"
                            className="text-primary-text tracking-tight"
                        >
                            PinClone
                        </AppText>
                    </View>
                </View>

                <AppButton
                    onPress={handleGoogleLogin}
                    loading={loading}
                    variant="secondary"
                    size="lg"
                    fullWidth
                    className="bg-foreground mb-4"
                    textClassName="text-black ml-2"
                    icon={<Chrome color="black" size={20} />}
                >
                    Sign in with Google
                </AppButton>

                <AppButton
                    variant="ghost"
                    onPress={() => router.navigate("./more-details")}
                    fullWidth
                    className="mb-12"
                    textClassName="text-tertiary-text"
                    size="xs"
                >
                    More details
                </AppButton>
            </View>

            <View className="pb-4 items-center">
                <AppText size="xs" className="text-tertiary-text">
                    v.{version}
                </AppText>
            </View>
        </ScreenWrapper>
    );
}
